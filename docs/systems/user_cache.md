---
title: Retrieving information about EOS users and Epic Games accounts
sidebar_label: The user cache system
description: Using the user cache system to retrieve information about other EOS users and Epic Games accounts.
---

The user cache system provides an API similar to the [IOnlineUser](/ossv1/user/id.mdx) interface, but independent of the online subsystem APIs. Internally the plugin uses the user cache system to implement the `IOnlineUser` interface, but you can also use it directly if you prefer the API structure.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the user cache system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSUserCache` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSUserCache",
});
```

## Obtaining the user cache system

To obtain a reference to the user cache system, call `GetSystem<IUserCacheSystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSUserCache/UserCacheSystem.h"

// Place at the top of function bodies that use the user cache system.
using namespace Redpoint::EOS::UserCache;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto UserCache = PlatformHandle->GetSystem<IUserCacheSystem>();
```

## The FUserInfo type

All of the user cache system APIs return shared references to `FUserInfo` instances, which provide the following information:

- `GetUserId`: The ID of the user that this `FUserInfo` instance represents.
- `GetMostRecentlySignedInPlatform`: If available, the platform that this user most recently signed into the game on.
- `GetLinkedExternalAccounts`: A list of all of the external accounts that this user has linked. For example, if the target user has played on Steam, this list would include the user's Steam ID.
- `GetLinkedEpicGamesAccount`: If set, additional information about the Epic Games account linked to this user's profile. This includes information such as the country, sanitized display name and preferred language of the target user.
- `GetAttributes`: Returns [user attributes documented under the Identity section of the documentation](/ossv1/identity/user_attributes.mdx#user-attributes-all-eos-accounts).
- `IsReady`: For `FUserInfo` instances obtained synchronously through `IUserCacheSystem::GetResolvedUser`, this function returns `true` once the user profile has finished loading in the background. If this function returns `false`, only `GetUserId` can return actual data; other functions will return empty information.

## The FErrorableUserInfo type

When retrieving multiple users through the user cache system, each individual target user may successfully load or fail. Thus the `FErrorableUserInfo` type encapsulates this "success-or-fail" status for each requested user:

- `IsErrored`: If true, `GetError` contains the error relevant for retrieving this specific user's information. Calling `GetUserInfo` when this returns true will result in an assert.
- `GetError`: Returns error information for the load of this target user.
- `GetUserInfo`: Returns the loaded `FUserInfo` as a shared reference, or asserts if `IsErrored` returns true.

## Get information on a single user

To get information on a single EOS user asynchronously, use `IUserCacheSystem::GetUser` like so:

```cpp
UserCache->GetUser(
    LocalUserId,
    TargetUserId,
    FOnGetUserComplete::CreateSPLambda(this, [this](FError ErrorCode, FUserInfoPtr UserInfo) {
        if (ErrorCode.WasSuccessful())
        {
            // UserInfo is valid.
        }
    }));
```

## Get information on multiple users

To get information on multiple EOS users asynchronously, use `IUserCacheSystem::GetUsers` like so:

```cpp
TArray<UE::Online::FAccountId> TargetUserIds;
TargetUserIds.Add(/* ... */);
TargetUserIds.Add(/* ... */);
UserCache->GetUsers(
    LocalUserId,
    TargetUserIds,
    FOnGetUsersComplete::CreateSPLambda(this, [this](FError CallErrorCode, TMap<UE::Online::FAccountId, FErrorableUserInfo> UserInfos) {
        if (!(*CallErrorCode.bWasSuccessful))
        {
            // There was some call-level error, such as the LocalUserId not being valid, that prevented the user cache system from even attempting to retrieve information about the requested user IDs.
            return;
        }

        for (const auto& KV : UserInfos)
        {
            // KV.Key is the requested account ID from TargetUserIds.
            // KV.Value is an FErrorableUserInfo with either the load error or the loaded FUserInfo.
        }
    }));
```

## Lookup users by external account IDs

To lookup users based on external accounts that they have linked, use `IUserCache::GetUsersByExternalAccountIds`:

```cpp
TArray<FString> ExternalAccountIds;
ExternalAccountIds.Add(/* ... */);
ExternalAccountIds.Add(/* ... */);
UserCache->GetUsersByExternalAccountIds(
    LocalUserId,
    EOS_EExternalAccountType::EOS_EAT_STEAM,
    ExternalAccountIds,
    FOnGetUsersByExternalAccountIdsComplete::CreateSPLambda(this, [this](FError CallErrorCode, TMap<FString, FErrorableUserInfo> UserInfos) {
        if (!(*CallErrorCode.bWasSuccessful))
        {
            // There was some call-level error, such as the LocalUserId not being valid, that prevented the user cache system from even attempting to retrieve information about the requested external account IDs.
            return;
        }

        for (const auto& KV : UserInfos)
        {
            // KV.Key is the requested external account ID from ExternalAccountIds.
            // KV.Value is an FErrorableUserInfo with either the load error or the loaded FUserInfo.
        }
    }));
```

## Lookup users by Epic Games account display names

To lookup users based on Epic Games account display names, use `IUserCache::GetUsersByEpicGamesDisplayNames`. The local user must be signed into an Epic Games account in order for this call to succeed.

```cpp
TArray<FString> DisplayNames;
DisplayNames.Add(/* ... */);
DisplayNames.Add(/* ... */);
UserCache->GetUsersByEpicGamesDisplayNames(
    LocalUserId,
    DisplayNames,
    FOnGetUsersByEpicGamesDisplayNamesComplete::CreateSPLambda(this, [this](FError CallErrorCode, TMap<FString, FErrorableUserInfo> UserInfos) {
        if (!(*CallErrorCode.bWasSuccessful))
        {
            // There was some call-level error, such as the LocalUserId not being valid, that prevented the user cache system from even attempting to retrieve information about the requested display names.
            return;
        }

        for (const auto& KV : UserInfos)
        {
            // KV.Key is the requested external account ID from DisplayNames.
            // KV.Value is an FErrorableUserInfo with either the load error or the loaded FUserInfo.
        }
    }));
```

## Synchronously get an FUserInfo, and let it load in the background

If you're in a context where you can not use the asynchronous APIs, and need an `FUserInfo` instance to return immediately, you can use `IUserCacheSystem::GetUnresolvedUser`. This will return an `FUserInfo` instance that initially does not have any loaded information, and has `IsReady()` returning false, but the Redpoint EOS plugin will continue to attempt to load the target user's information in the background, and the `FUserInfo` instance will automatically start returning real data from its functions once the load is complete.

```cpp
auto UserInfo = UserCache->GetUnresolvedUser(LocalUserId, TargetUserId);
```

## Clearing the cache

To clear the previously cached `FUserInfo` instances, call `IUserCacheSystem::ClearCache`. This call is primarily for debugging purposes and you should not need to call it.

```cpp
UserCache->ClearCache(LocalUserId);
```
