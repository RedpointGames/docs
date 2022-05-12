---
title: Submitting match results in C++
sidebar_label: Submitting match results
description: Learn how to submit match results from blueprints.
---

If you're using skill-based matchmaking, your game server will need to submit match results once the game is complete.

You can submit match results in C++ by calling the `SubmitMatchResults` function, like so:

```cpp
IMatchmakingEngine::Get()->SubmitMatchResults(
    // The local user submitting the stats.
    LocalUserId,
    // The IOnlineStats interface.
    Stats,
    // The stat prefix that was used originally during matchmaking.
    TEXT("mmr"),
    // The original matchmaking response received from OnResultsReady or OnComplete.
    OriginalResponse,
    // The scores for each team. There must be the same number of entries as there are teams.
    TArray<double>{50.0, 10.0, 100.0},
    // The callback fired once match results have been submitted.
    FMatchmakingEngineSubmitComplete::CreateLambda([](const FOnlineError & Error){
        if (!Error.bSucceeded)
        {
            // Unable to update skill ratings for one or more players.
        }
    }));
```

In the example above, we are reporting the scores as follows:

- Team 0 scored 50 points.
- Team 1 scored 10 points.
- Team 2 scored 100 points.

The plugin will order the teams by their score, and then adjust each player's Openskill ranking based on whether they won or lost the match.

:::caution
Due to a bug in the EOS SDK, if you're using EOS Online Framework, players must be connected to the server in order to have their rankings updated. This issue will be resolved when Epic fixes the underlying bug in the EOS SDK.
:::
