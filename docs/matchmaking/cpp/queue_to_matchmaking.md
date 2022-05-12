---
title: Queuing to matchmaking in C++
sidebar_label: Queue to matchmaking
description: Learn how to submit a matchmaking request in C++.
---

When a player is ready to queue into matchmaking, you submit a matchmaking request to the matchmaking engine. Unlike the blueprint nodes, the C++ API does not track player ready status, so you'll need to do that yourself if you're using the C++ API.

There are two ways to queue into matchmaking:

- As a **host**. If the player is queuing solo, or is the leader of the party, this is the way they should queue.
- As a **client**. If the player is in a party, but is _not_ the leader, they should queue this way.

These two ways of queuing also differ in _when_ the requests should be made:

- Hosts should queue when they and the rest of the party are ready to participate in matchmaking.
- Clients should queue immediately, as the matchmaking process will listen for the host of the party to queue.
- If the leader of the party changes, then the client that is promoted to the party leader should cancel their client queue process. They should then queue as a host when the party is ready to queue.

This process is a little complicated for parties, but you can [refer to the Blueprint Matchmaker implementation](https://src.redpoint.games/redpointgames/matchmaking/-/blob/main/Matchmaking/Source/MatchmakingMatchmaker/Private/Matchmaker.cpp) to see how it handles the lifecycle of party members and matchmaking.

:::info
The C++ API is considered less stable than the blueprint APIs. Some settings below might change slightly as new versions of the plugin are released (typically so we can add new features).

At some point in the future, the C++ API will be stabilized and we'll avoid making backwards incompatible changes.
:::

## Setting up the request (on both hosts and clients)

To queue into matchmaking, you need to construct an `FMatchmakingEngineRequest` and then queue it up to the engine with `Enqueue`. There's some general set up you need to do in each request, which is documented inline in the code below:

```cpp
// Include the matchmaking engine header.
#include "RedpointMatchmaking/MatchmakingEngine.h"

// Include the lobby interface headers, for the Online::GetLobbyInterface call below.
// You should copy the header files here: https://src.redpoint.games/redpointgames/online-interfaces/
// into your project and include the lobby interface.
#include "Interfaces/OnlineLobbyInterface.h"

// Include the online subsystem headers, for the rest of the Online:: calls.
#include "OnlineSubsystemUtils.h"

// Include the engine header, which is required for GEngine access.
#include "Engine/Engine.h"

// ...

// Create the request that you'll queue up.
FMatchmakingEngineRequest Request = {};

// You need to pass the identity, lobby, party and session interfaces to the request.
// This is so that the matchmaker can access the relevant subsystem.
Request.Identity = Online::GetIdentityInterface(this->GetWorld());
Request.Lobby = Online::GetLobbyInterface(Online::GetSubsystem(this->GetWorld()));
Request.PartySystem = Online::GetPartyInterface(this->GetWorld());
Request.Stats = Online::GetStatsInterface(this->GetWorld());
Request.Session = Online::GetSessionInterface(this->GetWorld());

// Pass the world context handle. This is so the matchmaker can identify which "play-in-editor"
// instance this matchmaking request is occurring in.
Request.WorldContextHandle = GEngine->GetWorldContextFromWorldChecked(this->GetWorld()).ContextHandle;

// Pass the user ID of the player that is queuing up. The code below just gets the user ID
// of the first local player controller. For split-screen games on consoles
// you'll need to actually figure out the user ID based on the controller input.
//
// NOTE: The code below assumes the local player is signed in (or has been validated as
// signed in). If you're not already checking that, you'll need to add nullptr checks.
Request.UserId = this->GetWorld()
    ->GetFirstPlayerController()
    ->GetLocalPlayer()
    ->GetPreferredUniqueNetId()
    .GetUniqueNetId();

// Pass the party ID, if the player is queuing in a party. You can pass `nullptr` here if
// the user is queuing solo.
Request.PartyId = PartyId.AsShared();

// For clients this should be `nullptr`. For hosts, see the documentation further on for
// the settings to pass here.
Request.HostConfiguration = nullptr;

// When matchmaking completes, what should the matchmaker do? There are currently three
// supported options and clients and hosts must have the same setting:
// - ReturnResults: OnComplete is fired with the results.
// - StartListenServerWithMap: The matchmaker will start a multiplayer listen server and
//   get players to join it.
// - FindDedicatedServer: The matchmaker will search for a dedicated server to play on and
//   get players to join it.
Request.CompletionBehaviour.Type = EMatchmakingEngineCompletionBehaviourType::StartListenServerWithMap;

// If the completion type is *not* set to "ReturnResults", this callback fires as soon as
// the matchmaking results are ready. This happens before the listen server is started or
// before clients join the game server, which is necessary if you want to be able to use
// the matchmaking results in game mode events like "Choose Player Start".
Request.CompletionBehaviour.OnResultsReady = FMatchmakingEngineRequestComplete::Create...(...);

// This callback is fired when matchmaking completes. That's either when the results are
// ready (for ReturnResults), or when the listen server is started or the player joined to
// the listen server (for StartListenServerWithMap).
Request.CompletionBehaviour.OnComplete = FMatchmakingEngineRequestComplete::Create...(...);

// For StartListenServerWithMap and FindDedicatedServer, this indicates whether or not
// players should join via the session ID or directly via the connection URL. Some
// subsystems (like Steam), don't support the FindSessionById function on IOnlineSession.
// If your subsystem doesn't support FindSessionById, then this will need to be set to false.
Request.CompletionBehaviour.bConnectViaSessionID = true;

// For StartListenServerWithMap, this is the map that the listen server will be started on.
Request.CompletionBehaviour.MapName = FName(TEXT("/Game/MultiplayerMap"));

// For FindDedicatedServer, this is the port the dedicated server beacon is listening on.
// This value defaults to 9990, which is the default port.
Request.CompletionBehaviour.DedicatedServerBeaconPort = 9990;

// For FindDedicatedServer, this callback is used to get the session search parameters when
// the matchmaker is looking for dedicated servers to play on.
Request.CompletionBehaviour.OnGetDedicatedServerSearchParams =
    FMatchmakingEngineGetDedicatedServerSearchParams::Create...(...);

// This callback is fired as matchmaking progresses. Refer to the blueprint documentation
// on what kind of information this callback returns.
Request.OnProgress = FMatchmakingEngineRequestProgress::Create...(...);

// This callback is fired if you cancel the matchmaking request.
Request.OnCancelled = FMatchmakingEngineRequestCancelled::Create...(...);

// This callback is fired if matchmaking encounters an unrecoverable error.
Request.OnError = FMatchmakingEngineRequestError::Create...(...);
```

## Specifying host configuration

If you're queueing as a host, you'll need to provide information about team layouts, completion behaviour and timeouts:

```cpp
// Construct the host configuration.
auto RequestHostConfiguration = MakeShared<FMatchmakingEngineRequestHostConfiguration>();

// Set the request ID. This should be a fairly unique int64 value, and is used internally
// by the algorithm. If this value isn't unique enough, matchmaking won't work properly.
RequestHostConfiguration->RequestId = FDateTime::UtcNow().GetTicks();

// Set the matchmaking queue name. Requests in different queues will never be matched
// together.
RequestHostConfiguration->QueueName = FName(TEXT("Default"));

// Set the player counts on each team. In the example below, we're setting up a 4v4 match.
TArray<int32> TeamCapacities;
TeamCapacities.Add(4);
TeamCapacities.Add(4);
RequestHostConfiguration->TeamCapacities = TeamCapacities;

// When we run out of time, and there's no more players online to bring into our match,
// what should the matchmaker do? Available options are:
// - EMatchmakingBehaviourOnNoCandidates::WaitUntilFull: Ignore the timeouts and continue
//   searching indefinitely. If your game doesn't work with partially filled or unbalanced
//   teams, this is the option to pick. Note however that "estimated time to completion"
//   will be inaccurate once the timeout has run out, since the players could be waiting
//   forever if no-one else comes online.
// - EMatchmakingBehaviourOnNoCandidates::CompletePartiallyFilled: The match will be completed
//   with the remaining slots set to "Empty".
// - EMatchmakingBehaviourOnNoCandidates::CompleteFillWithAI: The match will be completed
//   with the remaining slots set to "AI". This is currently the same behaviour as
//   CompletePartiallyFilled but we might spawn AI controllers for you in future if the the
//   matchmaking engine is also starting a listen server.
RequestHostConfiguration->OnNoCandidates = EMatchmakingBehaviourOnNoCandidates::CompletePartiallyFilled;

// When the matchmaker is configured to accept partially filled matches, this specifies the
// minimum number of team members on each team that must be met for a partial fill to be accepted.
// You can use this to guarantee that, even for partial fills, each team will still have a minimum
// number of players on it. If the timeout is reached and one or more teams don't have the minimum
// number of players, matchmaking will continue as if the timeout was longer.
RequestHostConfiguration->MinimumTeamMemberCountForPartialFill = 0;

// The timeout for matchmaking is calculated as:
//   baseline seconds + (remaining slots * per slot seconds)
// Typically that means the more empty the match, the longer we're willing to wait for
// more players to be online.
//
// If you set these settings too low, the matchmaker won't have enough time to find
// players and you'll get a large number of partially filled matches. The defaults here
// are usually good.
RequestHostConfiguration->MinimumWaitSecondsBaseline = 60;
RequestHostConfiguration->MinimumWaitSecondsPerEmptySlot = 5;

// Specifies how we fill teams in matchmaking. Because of the way the algorithm works, you
// have to choose between the following options when there aren't new solo players queuing
// up into matchmaking:
// - MaximizeTeamFill: You're more likely to get a completely full match, but if there
//   aren't new players you'll get an unbalanced result (like "4v1" for "4v4").
// - MaximizeBalance: You're more likely to get a balanced result (like "2v2" for "4v4"),
//   but if there aren't new players you'll get a less full match (only 4 players in
//   game instead of the 5 in the MaximizeTeamFill example).
RequestHostConfiguration->BalanceMode = EMatchmakingBalanceMode::MaximizeTeamFill;

// If this is set to something other than an empty string, enables skill-based matchmaking.
// The <prefix>_mu and <prefix>_sigma values will be used for each player to match players
// based on their skill rating.
//
// Refer to the "Turning on skill-based matchmaking" document for more information.
RequestHostConfiguration->SkillStatPrefix = TEXT("mmr");

// If this is set, defines how close the balance of the resulting teams must be in order for
// a candicate can be considered for matchmaking.
//
// That is, for every candidate that matchmaking finds from it's searches, it evaluates
// the probabilities of each team winning the game if the candidate were accepted. This
// threshold is the maximum difference in win probabilities before the candidate is
// excluded (because it would unbalance the game too severely).
//
// The context provides the seconds remaining before timeout and the maximum seconds for
// the timeout in the matchmaking iteration so that you can scale the returned value
// based on how much time is left (that is, you can make it tolerate less ideal matches
// the closer it is to timing out with a partially filled match).
//
// If you don't set this, it defaults to:
//
// 10.0 + (1.0 - FMath::Max(0.0, (SecondsRemaining / (IterationMaximumSecondsRemaining - 5.0)))) * 90.0
//
// which starts off tolerating a 10% difference all the way up to a 100% difference if the
// match is about to timeout.
RequestHostConfiguration->SkillThresholdFunction =
    FMatchmakingSkillThresholdFunction::CreateLambda([](
        const FMatchmakingSkillThresholdFunctionContext &Context) {
        // This example only allow a 5% balance difference, regardless
        // of the time remaining.
        return 5.0;
    });

// Set the host configuration to the request.
Request.HostConfiguration = RequestHostConfiguration;
```

## Queuing into matchmaking

Once the request is prepared, you can queue up the request into matchmaking:

```cpp
// Queue up the request! The returned handle allows you to cancel the matchmaking request later.
FMatchmakingEngineRequestHandle RequestHandle = IMatchmakingEngine::Get()->Enqueue(Request);
```
