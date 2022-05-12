---
title: Reading and managing cross-platform friends
sidebar_label: The friend system
description: Using the friend system to read and manage cross-platform friends.
---

The friend system provides a common API for reading and managing cross-platform friends.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the friend system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSFriends` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSFriends",
});
```

## Obtaining the friend system

To obtain a reference to the friend system, call `GetSystem<IFriendSystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSFriends/FriendSystem.h"

// Place at the top of function bodies that use the friend system.
using namespace Redpoint::EOS::Friends;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto FriendSystem = PlatformHandle->GetSystem<IFriendSystem>();
```

## Friend concepts

The friend system allows you to view cross-platform friends, and friends that are specific to the platform the user is playing on. In the friend system, cross-platform friends are called **unified** friends:

- **Unified friends:** These friends have played the game before and have an EOS user ID. Full presence information is available for these friends, as presence data is transmitted through EOS.
- **Non-unified friends:** These friends have never played the game before and only have a user ID from the local platform. Only very basic presence information is available for these friends, such as whether they're online. You often only need to know whether these friends are online for the purposes of a player sending an invite to them, since once they play the game for the first time, they'll appear as a unified friend from that point onwards.

## Get the list of friends

To get the list of friends for a local player, use `GetFriends`:

```cpp
TAccountIdMap<FUserInfoRef> UnifiedFriends;
TArray<FExternalUserInfoRef> NonUnifiedFriends;

auto Error = FriendSystem->GetFriends(
    LocalUserId,
    UnifiedFriends,
    NonUnifiedFriends);
if (Error.WasSuccessful())
{
    // UnifiedFriends and NonUnifiedFriends were populated with the list of friends.
}
```

## Detect when the list of friends changes

To detect when the friends list changes, listen for the `OnFriendsChanged` event:

```cpp
FriendSystem->OnFriendsChanged().AddSPLambda(
    this,
    [this](const FIdentityUserId &LocalUserId, ERelationshipType ChangedRelationships) {
        if ((ChangedRelationships | ERelationshipType::MutualFriends) != ERelationshipType::None)
        {
            // The friends returned by GetFriends has changed.
        }
        else if ((ChangedRelationships | ERelationshipType::IncomingFriendRequest) != ERelationshipType::None)
        {
            // The list of incoming friend requests returned by GetInboundFriendRequests has changed.
        }
        else if ((ChangedRelationships | ERelationshipType::OutgoingFriendRequest) != ERelationshipType::None)
        {
            // The list of incoming friend requests returned by GetOutboundFriendRequests has changed.
        }
        else if ((ChangedRelationships | ERelationshipType::Blocked) != ERelationshipType::None)
        {
            // The list of blocked players returned by GetBlockedPlayers has changed.
        }
        else if ((ChangedRelationships | ERelationshipType::RecentPlayer) != ERelationshipType::None)
        {
            // The list of recent players returned by GetRecentPlayers has changed.
        }
    });
```

## Get the presence information for a cross-platform friend

To get the presence information for a cross-platform friend, use `GetUnifiedFriendPresence`. This returns the same presence information that you could obtain via [the presence system](/systems/presence.md), except that the friend system maintains the interest list automatically so the presence information is immediately available after login.

```cpp
auto Presence = FriendSystem->GetUnifiedFriendPresence(
    LocalUserId,
    FriendUserId);
```

## Get the presence status for a friend on the local platform, who has not played this game before

To get the presence information for a friend on the local platform who hasn't played the game before, use `GetNonUnifiedFriendPresence`. The `FriendUser` parameter should be a user object previously obtained through a call to `GetFriends`.

```cpp
auto Presence = FriendSystem->GetNonUnifiedFriendPresence(
    LocalUserId,
    FriendUser);
```

## Get the list of inbound friend requests

To get the list of inbound friend requests, those that you are yet to respond to, use `GetInboundFriendRequests`:

```cpp
TAccountIdMap<FUserInfoRef> InboundFriendRequests;

auto Error = FriendSystem->GetInboundFriendRequests(
    LocalUserId,
    InboundFriendRequests);
if (Error.WasSuccessful())
{
    // InboundFriendRequests were populated with the list of inbound friend requests.
}
```

## Get the list of outbound friend requests

To get the list of outbound friend requests, those that you have sent but are yet to receive a response for, use `GetOutboundFriendRequests`:

```cpp
TAccountIdMap<FUserInfoRef> OutboundFriendRequests;

auto Error = FriendSystem->GetOutboundFriendRequests(
    LocalUserId,
    OutboundFriendRequests);
if (Error.WasSuccessful())
{
    // OutboundFriendRequests were populated with the list of outbound friend requests.
}
```

## Detect when a new friend request is received

To detect when a new friend request is received, listen for the `OnFriendRequestReceived` event. The `OnFriendsChanged` event will also fire after this event.

```cpp
FriendSystem->OnFriendRequestReceived().AddSPLambda(
    this,
    [this](const FIdentityUserId &LocalUserId, const FUserInfoRef &SendingRemoteUser) {
        // LocalUserId is the local user who received the friend request.
        // SendingRemoteUser is the remote user who sent the friend request.
    });
```

## Send a friend request

To send a friend request another user who has or is currently playing this game, use `SendFriendRequest`:

```cpp
FriendSystem->SendFriendRequest(
    LocalUserId,
    // The target to invite.
    RemoteUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FSendFriendRequestResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The friend request was successfully sent.
        }
    });
```

## Accept a friend request

To accept a friend request that was previously received, use `AcceptFriendRequest`:

```cpp
FriendSystem->AcceptFriendRequest(
    // The local player who received the invite.
    LocalUserId,
    // The person who sent the original invite.
    RemoteRequesterUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FAcceptFriendRequestResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The friend request was successfully accepted.
        }
    });
```

## Reject a friend request

To reject a friend request that was previously received, use `RejectFriendRequest`:

```cpp
FriendSystem->RejectFriendRequest(
    // The local player who received the invite.
    LocalUserId,
    // The person who sent the original invite.
    RemoteRequesterUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FRejectFriendRequestResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The friend request was successfully rejected.
        }
    });
```

## Check if a friend can be deleted from the friend list

Only friends that were added via `SendFriendRequest` / `AcceptFriendRequest` can be deleted from the friend list. You can check if a friend can be deleted with `IsFriendDeletable`:

```cpp
bool bIsDeletable = FriendSystem->IsFriendDeletable(
    // The local player who has the friend.
    LocalUserId,
    // The friend's user ID.
    RemoteFriendUserId);
```

## Delete a friend

If a friend can be deleted, you can delete them by calling `DeleteFriend`:

```cpp
FriendSystem->DeleteFriend(
    // The local player who has the friend.
    LocalUserId,
    // The friend's user ID.
    RemoteFriendUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FDeleteFriendResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The friend was successfully deleted.
        }
    });
```

## Get a list of recent players

To get the list of players that a local player has recently seen or played with, use `GetRecentPlayers`. The date time value in the tuple represents when the player was last seen.

```cpp
TAccountIdMap<TTuple<FUserInfoRef, FDateTime>> RecentPlayers;

auto Error = FriendSystem->GetRecentPlayers(
    LocalUserId,
    RecentPlayers);
if (Error.WasSuccessful())
{
    // RecentPlayers were populated with the list of recent players.
}
```

## Record another player as a recent player

If you want to manually record a player on the recent player list for all locally signed in players, use `RecordRecentPlayer`. You should not need to call this, as the plugin automatically records recent players when in multiplayer games.

```cpp
FriendSystem->RecordRecentPlayer(RemoteUserId);
```

## Get a list of blocked players

To get the list of players that the local player has blocked, use `GetBlockedPlayers`.

```cpp
TAccountIdMap<FUserInfoPtr> BlockedPlayers;

auto Error = FriendSystem->GetBlockedPlayers(
    LocalUserId,
    BlockedPlayers);
if (Error.WasSuccessful())
{
    // BlockedPlayers were populated with the list of blocked players.
}
```

## Block a player

To block another player from interacting with the local player, use `BlockPlayer`. Currently you must use `GetBlockedPlayers` to get the list of blocked players and prevent interactions manually; the plugin will not prevent matchmaking or session joins which would result in blocked players interacting.

```cpp
FriendSystem->BlockPlayer(
    // The local player who wants to block a player.
    LocalUserId,
    // The target user ID to block.
    BlockedUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FBlockPlayerResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The target user was successfully blocked.
        }
    });
```

## Unblock a player

To unblock another player from interacting with the local player, use `UnblockPlayer`.

```cpp
FriendSystem->UnblockPlayer(
    // The local player who wants to unblock a player.
    LocalUserId,
    // The target user ID to unblock.
    BlockedUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FUnblockPlayerResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The target user was successfully unblocked.
        }
    });
```

## Change the local alias for a friend on the friend list

You can allow a local player to set an alias for a friend on their friend list using `SetFriendAlias`. Aliases are only visible to the local player who set them.

```cpp
FriendSystem->SetFriendAlias(
    LocalUserId,
    FriendUserId,
    NewFriendAlias)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FSetFriendAliasResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The alias was set for the friend.
        }
    });
```

## Remove the local alias for a friend on the friend list

You can allow a local player to remove an alias that they previously set for a friend on their friend list using `DeleteFriendAlias`.

```cpp
FriendSystem->DeleteFriendAlias(
    LocalUserId,
    FriendUserId)
    /* Returns a TFuture, which we then call Next on to respond when it's done. */
    .Next([](IFriendSystem::FDeleteFriendAliasResult Result) {
        if (Result.ErrorCode.WasSuccessful())
        {
            // The alias was removed for the friend.
        }
    });
```

## Get the local alias for a friend on the friend list

To get an alias that a local player previously set for a friend, use `GetFriendAlias`. This function returns a `TOptional<FString>`, which is unset if no alias has been set.

```cpp
auto Alias = FriendSystem->GetFriendAlias(
    LocalUserId,
    FriendUserId);
```
