---
title: Updating and retrieving cross-platform presence
sidebar_label: The presence system
description: Using the presence system to set cross-platform presence and view the presence state of other players.
---

The presence system provides access to a cross-platform presence system that works everywhere, and allows you to view the presence status of any other player in your game regardless of whether they're playing on the same platform.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the presence system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSPresence` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSPresence",
});
```

## Obtaining the presence system

To obtain a reference to the presence system, call `GetSystem<IPresenceSystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSPresence/PresenceSystem.h"

// Place at the top of function bodies that use the presence system.
using namespace Redpoint::EOS::Presence;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto Presence = PlatformHandle->GetSystem<IPresenceSystem>();
```

## Presence concepts

The presence system works differently than the online subsystem `IOnlinePresence` interface. Instead of explicitly querying for another user's presence status, you express _interest_ in other user IDs. Multiple "systems" can have their own presence interest lists, which means if one system stops being interested in a target user ID, it doesn't prevent other systems from receiving presence updates for that user. Only when there are no systems interested in a user does the presence system cease polling their status.

For general game code, the interested system name should be `NAME_Game`.

## The FPresenceUserState type

Presence for local and remote users is encapsulated in the `FPresenceUserState` type. Some of the fields on this structure are read-only, even for local users, since their value is managed by the presence system itself.

- `UserId`: The user that this presence state is for.
- `bPresenceAdvertised`: _Read-only._ This value is updated by the presence system and is set based on whether the runtime platform permits presence. For example, if a player marks themselves as Offline on Steam Friends, this value may be set to false by the runtime platform integration to prevent presence being advertised on Epic Online Services as well.
- `AdvertisedSession`: _Read-only._ This value is updated by the presence system in response to session-based rooms having the presence room feature.
  - **Note:** Until the room system refactoring work is complete, this value is currently always unset.
- `AdvertisedParty`: _Read-only._ This value is updated by the presence system in response to lobby-based rooms having the presence room feature and party type room features. Creating a party via `IOnlineParty` with presence enabled will populate this field for a local user.
- `ActivityState`: The current activity state of the user, whether they are online, idle, "do not disturb" or offline.
- `StatusTextFormat`: The localised text format string, such as `NSLOCTEXT("MyGame", "PresenceStatus", "{Rounds} rounds remaining")`.
- `StatusTextFormatArguments`: The name arguments to use as inputs to the localised text format string when rendering it, such as `FFormatNamedArguments{{TEXT("Rounds"), FFormatArgumentValue(10)}}`.
- `CustomAttributes`: Custom attributes that you want to store/retrieve on presence states.
- `GetStatusTextFormatted()`: Returns the formatted text based on the `StatusTextFormat` and `StatusTextFormatArguments` values, such as "10 rounds remaining".

## Updating a local user's presence

To update the presence status of a local user, call `IPresenceSystem::SetPresence`:

```cpp
auto NewPresenceState = FPresenceUserState(LocalUserId);
NewPresenceState.StatusTextFormat = NSLOCTEXT("MyGame", "PresenceStatus", "{Rounds} rounds remaining");
NewPresenceState.StatusTextFormatArguments = FFormatNamedArguments{{TEXT("Rounds"), FFormatArgumentValue(10)}};
// ...
Presence->SetPresence(
    LocalUserId,
    NewPresenceState,
    IPresenceSystem::FOnSetPresenceComplete::CreateSPLambda(this, [this](const FError &ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // The local user's presence was updated. The actual update may be deferred until later.
        }
    }));
```

To incrementally update a local user's presence, call `IPresenceSystem::GetPresence` to get their existing presence, modify the returned value, and then call `IPresenceSystem::SetPresence`:

```cpp
TOptional<FPresenceUserState> ExistingPresence = Presence->GetPresence(
    LocalUserId,
    LocalUserId);
auto NewPresenceState = ExistingPresence.IsSet() ? ExistingPresence.Get() : FPresenceUserState(LocalUserId);
NewPresenceState.StatusTextFormat = NSLOCTEXT("MyGame", "PresenceStatus", "{Rounds} rounds remaining");
NewPresenceState.StatusTextFormatArguments = FFormatNamedArguments{{TEXT("Rounds"), FFormatArgumentValue(10)}};
// ...
// Call SetPresence as above.
```

## Registering interest in another user's presence

To change the presence interest list for your system, call `IPresenceSystem::UpdatePresenceInterest`:

```cpp
// Set up the array that indicates how we want our interest list to change.
// This is a delta; any user IDs not listed here will remain on the interest
// list if they were previously added.
TArray<FPresenceInterestChange> InterestListChanges;
InterestListChanges.Add(FPresenceInterestChange(InterestedInTargetUserId, true /* bInterested */));
InterestListChanges.Add(FPresenceInterestChange(NoLongerInterestedInTargetUserId, false /* bInterested */));

// Update the presence interest list.
Presence->UpdatePresenceInterest(
    NAME_Game /* InterestedSystem */,
    LocalUserId,
    InterestListChanges,
    true /* bWaitForInitialPresenceData */,
    IPresenceSystem::FOnUpdatePresenceInterestComplete::CreateSPLambda(
        this,
        [this](
            const FError &ErrorCode,
            const TMap<FIdentityUserId, FPresenceUserState> &RemoteUserPresenceState)
        {
            if (ErrorCode.WasSuccessful())
            {
                // The local user's interest list was updated.

                // If bWaitForInitialPresenceData was true when calling UpdatePresenceInterest,
                // RemoteUserPresenceState contains a map of all new interested target user
                // IDs to their current presence status. Otherwise, the
                // FOnUpdatePresenceInterestComplete callback fires immediately and the
                // RemoteUserPresenceState value is an empty map.
            }
        }));
```

## Get the current presence of a local or remote user

To get the current presence state of a local or remote user, use `IPresenceSystem::GetPresence`:

```cpp
TOptional<FPresenceUserState> ExistingPresence = Presence->GetPresence(
    LocalUserId,
    TargetUserId);
if (ExistingPresence.IsSet())
{
    // Presence state available.
}
else
{
    // Presence state not available. Either we're not interested in the target
    // user and aren't fetching their presence state, or we haven't fetched
    // their initial presence state yet.
}
```

## Get notified when a remote user's presence changes

To get notified when a remote user's presence changes, bind to the `IPresenceSystem::OnRemoteUserPresenceStateUpdated(InterestedSystem)` delegate:

```cpp
auto Handle = Presence->OnRemoteUserPresenceStateUpdated(NAME_Game).AddSPLambda(
    this,
    [this](
        const FIdentityUserId &LocalUserId,
        const FIdentityUserId &TargetUserId,
        const FPresenceUserState &NewPresenceState)
    {
        // NewPresenceState contains the target user's new presence state.
    });
```

You will only receive presence state notifications for target users that your system indicated it is interested in via `UpdatePresenceInterest`. That is, if system `A` indicates it is interested in a user, a handler bound to `OnRemoteUserPresenceStateUpdated(B)` will not receive notifications for that user.

You can listen for presence change notifications from all users that any system is interested in by passing `NAME_All` as the `InterestedSystem` argument to `OnRemoteUserPresenceStateUpdated`.

## Access a local user's friend code

To access a local user's friend code, use `IPresenceSystem::GetFriendCode`:

```cpp
TOptional<FString> FriendCode = Presence->GetFriendCode(LocalUserId);
if (FriendCode.IsSet())
{
    // Call FriendCode.Get() to access.
}
```

The only scenario where GetFriendCode returns an unset value is if the user ID is not a signed in local user.

## Resolve a friend code into a user ID

To resolve a friend code into one or more user IDs, use `IPresenceSystem::FindByFriendCode`. Extremely rarely, in games with high player counts, a friend code may map to multiple online players. In this case, you should display the list of found players and let the user select which one they intended to lookup.

```cpp
Presence->FindByFriendCode(
    LocalUserId,
    FriendCode,
    FOnFindByFriendCodeComplete::CreateSPLambda(
        this,
        [this](
            const FError &ErrorCode,
            const TArray<FUserInfoRef> &DiscoveredUsers)
        {
            if (ErrorCode.WasSuccessful())
            {
                // DiscoveredUsers contains 0 or more users. It is not an error if no users are found.
            }
        }));
```

## Open a low-frequency reliable message channel to another player

The presence system supports opening low-frequency reliable message channels to remote users. Please note the following limitations:

- You should use this system sparingly, if at all.
- Each connection results in the local user joining the remote user's lobby, therefore you can not open lots of message channels at once.
- Each message sent _and received_ results in a lobby member data update.
- All messages have a type (`FName`) and content (arbitrary JSON value).

```cpp
Presence->TryOpenMessageConnection(
    LocalUserId,
    TargetUserId,
    NAME_Game,
    IPresenceSystem::FOnTryOpenMessageConnection::CreateSPLambda(
        this,
        [this](
            const FError &ErrorCode,
            const TSharedPtr<IPresenceMessageConnection> &MessageConnection)
        {
            if (ErrorCode.WasSuccessful())
            {
                // Use MessageConnection.
            }
        }));
```

If you are using this API, you will also need to listen for inbound message connections from other players:

```cpp
auto Handle = Presence->OnInboundMessageConnectionEstablished(NAME_Game).AddSPLambda(
    this,
    [this](
        const TSharedRef<IPresenceMessageConnection> &MessageConnection)
    {
        // Use MessageConnection to communicate with the incoming user.
    });
```

If you don't have a handler for an interested system (such as `NAME_Game`) and you attempt to establish a message connection, all message connections with that target player will close.

Once you have a message connection, you can send messages or close the connection:

```cpp
MessageConnection->SendMessage(
    FName(TEXT("MyMessageType")),
    MakeShared<FJsonValueString>(TEXT("My string value")),
    IPresenceMessageConnection::FOnSendMessageComplete::CreateSPLambda(
        this,
        [this](
            const FError &Error)
        {
            if (*Error.bWasSuccessful)
            {
                // The message was successfully sent and acknowledged by the peer.
            }
        }));
```

```cpp
MessageConnection->Close(
    IPresenceMessageConnection::FOnCloseComplete::CreateSPLambda(
        this,
        [this](
            const FError &Error)
        {
            if (*Error.bWasSuccessful)
            {
                // The connection was closed.
            }
        }));
```

When you receive an incoming message connection or establish an outbound message connection, you need to listen for incoming messages and for the connection close event:

```cpp
auto Handle = MessageConnection->OnMessageReceivedOrClose().AddSPLambda(
    this,
    [this](
        bool bIsClosed,
        const FName &MessageType,
        const TSharedPtr<FJsonValue> &Message,
        const FAckMessage &AckMessage)
    {
        if (bIsClosed)
        {
            // The connection was closed (no message data is present).
        }
        else
        {
            // Inspect MessageType to determine how to handle this message.
        }

        // Once you've handled the message, call AckMessage.
        AckMessage.ExecuteIfBound();
    });
```

If no handler acknowledges a message, the connection automatically closes as the protocol does not support retries. In this case, the original `SendMessage` call on the sender receives an error code in the callback.

## Detect when Internet connectivity is lost or restored

The presence system automatically detects when the Internet connection is lost or restored.

Loss of Internet connectivity is detected when the EOS SDK reports that the local user is disconnected from their own cross-platform presence lobby. Once Internet connectivity is lost, the presence system will periodically try to recreate the cross-platform presence lobby. Once it succeeds, the presence system reports that Internet connectivity is restored.

To listen for changes in Internet connectivity, use the `OnInternetConnectivityChanged` event:

```cpp
Presence->OnInternetConnectivityChanged().AddSPLambda(
    this,
    [this](
        IPresenceSystem::EInternetConnectivityStatus Status)
    {
        if (Status == IPresenceSystem::EInternetConnectivityStatus::Disconnected)
        {
            // Internet connectivity was lost.
        }
        else
        {
            // Internet connectivity has now been restored.
        }
    });
```

## Waiting for cross-platform presence to be reconciled

If you intend to use the `SendRoomInviteToNonUnifiedFriend` function on runtime platform integrations, you'll need to wait for the cross-platform presence system to reconcile with the local platform before sending room invites. This is primarily an internal API, and it's recommended that you use the OSSv1 APIs for sending invites instead.

```cpp
Presence->WaitForReconciledPresence(
    LocalUserId,
    FSimpleDelegate::CreateSPLambda(
        this,
        [this]()
        {
            // The local platform is now up-to-date with the latest party, session and presence information.
        }));
```
