---
title: Signing local users in and out
sidebar_label: The identity system
description: Using the identity system to sign local players in and out of Epic Online Services.
---

The identity system provides an API to sign players in and out of Epic Online Services, similar to the [IOnlineIdentity](/ossv1/identity/authentication.mdx) interface, but independent of the online subsystem APIs. Internally the plugin uses the identity system to implement the `IOnlineIdentity` interface, but you can also use it directly if you prefer the API structure.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the identity system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSIdentity` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSIdentity",
});
```

## Obtaining the identity system

To obtain a reference to the identity system, call `GetSystem<IIdentitySystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSIdentity/IdentitySystem.h"

// Place at the top of function bodies that use the identity system.
using namespace ::Redpoint::EOS::Identity;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto Identity = PlatformHandle->GetSystem<IIdentitySystem>();
```

## The FIdentityUser type

When users are signed into Epic Online Services, the identity system APIs will return shared references to `FIdentityUser` instances, which provide the following information:

- `GetUserSlot`: The local "slot" that this user is signed into, commonly also known as the "controller index". The "user slot" is only used for games which support multiple local players.
- `GetUserId`: The ID of the user that this `FIdentityUser` instance represents. The `FIdentityUserId` type is an alias of `UE::Online::FAccountId`, so you can use the [documented user ID functions](./user_id.md) to convert the user ID returned from this function to and from various types (including serializing and deserializing to string values).
- `GetRefreshCallback`: The delegate which will refresh authentication with the EOS backend when the current login token expires. The identity system internally uses this to keep local players signed in, and you should not need to call it yourself.
- `GetExternalCredentials`: If this user was authenticated using a local platform such as Steam, the `IOnlineExternalCredentials` instance returned by this function contains metadata about that external authentication, including the underlying token and attributes used to authenticate.
- `GetCrossPlatformAccountId`: If this user is signed into a cross-platform account such as an Epic Games account, this is the cross-platform account ID. When using Epic Games as the cross-platform account provider, this will be the ID of the Epic Games account.
- `GetProcessGlobalUserHandle`: The "process-wide" unique handle for this signed in user, as a `FPlatformUserId` value. This is used by the `IVoiceChatUser::Login` API to disambiguate signed in users across multiple play-in-editor windows.
- `GetAuthenticationAttributeKeys`: The authentication attributes for this locally signed in user. These are the [same attributes available on `FUserOnlineAccount`](/ossv1/identity/user_attributes.mdx#authentication-attributes-fuseronlineaccount-only).
- `TryGetAuthenticationAttributeValue`: Attempt to retrieve the value of the specified authentication attribute. You must use this call if you want to access the value of `crossPlatform.canLink`, `idToken` or `epic.idToken` attributes, as they are not returned by `GetStaticAuthenticationAttributes`.
- `GetStaticAuthenticationAttributes`: Returns a map of authentication attributes that are not dynamic (see `TryGetAuthenticationAttributeValue` above for a list of attribute values not returned in the resulting map).
- `GetIdToken`: Returns the EOS Connect ID Token. This returns the same value as calling `TryGetAuthenticationAttributeValue` for the `idToken` authentication attribute.
- `GetUserInfo`: Returns the [`FUserInfo` fetched through the user cache system](./user_cache.md#the-fuserinfo-type) for this locally signed in user.

## Signing a local user in

To sign a local player into Epic Online Services, use `IIdentitySystem::Login` like so:

```cpp
Identity->Login(
    FLoginRequest(0 /* user slot / controller index */)
    IIdentitySystem::FOnLoginComplete::CreateSPLambda(this, [this](FError ErrorCode, FIdentityUserPtr NewUser) {
        if (ErrorCode.WasSuccessful())
        {
            // NewUser is valid.
        }
    }));
```

If you've written a custom authentication graph, and you need to pass in `Type`, `Id` or `Token` for `FAuthenticationGraphState::ProvidedCredentials`, use the variant of the `FLoginRequest` contructor that passes these values:

```cpp
Identity->Login(
    FLoginRequest(0, TEXT("Type"), TEXT("Id"), TEXT("Token"))
    IIdentitySystem::FOnLoginComplete::CreateSPLambda(this, [this](FError ErrorCode, FIdentityUserPtr NewUser) {
        if (ErrorCode.WasSuccessful())
        {
            // NewUser is valid.
        }
    }));
```

## Signing a local user out

To sign a local player out of Epic Online Services, use `IIdentitySystem::Logout` like so:

```cpp
Identity->Logout(
    FLogoutRequest(0 /* user slot / controller index */)
    IIdentitySystem::FOnLogoutComplete::CreateSPLambda(this, [this](FError ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // Local user was signed out.
        }
    }));
```

## Getting notified when local users sign in and out

If you need to be notified when players are signed in and out of user slots, you can use the `IIdentitySystem::OnUserSlotChanged` event like so:

```cpp
// To start receiving event notifications:
FDelegateHandle Handle = Identity->OnUserSlotChanged().AddSPLambda(this, [this](
    FIdentityUserSlot UserSlot,
    EIdentityUserSlotState OldUserSlotState,
    FIdentityUserId OldUserId,
    EIdentityUserSlotState NewUserSlotState,
    FIdentityUserId NewUserId,
    EIdentityUserSlotChangeReason ChangeReason) {
    // UserSlot - The user slot / controller index that changed state.
    // OldUserSlotState - The previous state, either NotSignedIn or SignedIn.
    // OldUserId - If the previous state was SignedIn, the user ID that was previously signed into this user slot.
    // NewUserSlotState - The new state, either NotSignedIn or SignedIn.
    // NewUserId - If the new state was SignedIn, the user ID that is now signed into this user slot.
    // ChangeReason - The reason why this user slot is changing state:
    //   - ExplicitLogin: `IIdentitySystem::Login` was called when initially signed out and completed successfully.
    //   - ExplicitLogout: `IIdentitySystem::Logout` was called when initially signed in and completed successfully.
    //   - ExplicitLink: `IIdentitySystem::Login` was called while signed in and with a local user
    //                   account that could link to a cross-platform account. The user successfully linked their
    //                   local platform account to a cross-platform (Epic Games) account. When the change reason is
    //                   ExplicitLink, the old and new slot state will both be SignedIn and the old and new user ID
    //                   will be identical.
});

// Later, when you no longer need to receive event notifications:
Identity->OnUserSlotChanged().Remove(Handle);
```

## Getting the locally signed in user by user slot

To get the currently signed in user for a user slot (controller index), use `IIdentitySystem::GetUser(FIdentityUserSlot)`:

```cpp
FIdentityUserPtr LocalUser = Identity->GetUser(0 /* user slot / controller index */);
// @note: LocalUser may be nullptr if there is no user signed into that user slot / controller index.
```

## Getting the locally signed in user by user ID

To get a currently signed in user by their user ID, use `IIdentitySystem::GetUser(FIdentityUserId)`:

```cpp
FIdentityUserPtr LocalUser = Identity->GetUser(/* ... */);
// @note: LocalUser may be nullptr if the specified user ID is not currently signed in.
```

## Getting all locally signed in users

To get all users that are currently signed in, use `IIdentitySystem::GetUsers`:

```cpp
TArray<FIdentityUserRef> LocalUsers = Identity->GetUsers();
```

## Hooking into the identity system

The identity system provides hooks that you can use to intercept and alter the way sign in and sign out works in your game. These hooks are used internally by the plugin so notify all the relevant components when the login state changes, but you can write your own custom hooks to influence the login process.

To write an identity system hook, you need to declare a class that inherits from `IIdentityHook`. All of the functions on this interface are optional to implement - any you omit will have no effect. The available hook functions are:

- `OnPreLogin`: After `IIdentitySystem::Login` is called, but before authentication starts. If you return an error in the `OnComplete` callback, the `IIdentitySystem::Login` call fails with that error. You can use this to prevent login from starting based on the current game state.
- `OnPostLoginBeforeEvents`: After the authentication process completes (not necessarily successfully) as part of `IIdentitySystem::Login`, but before the `IIdentitySystem::OnUserSlotChanged` event is fired. This allows you to set up any internal state before code relying on `IIdentitySystem::OnUserSlotChanged` event notifications runs. Internally the plugin uses this to update the `FUniqueNetId` of local player states and player controllers, so that any blueprint code that runs in response to login completing will see valid player IDs on the local player controllers. If you return an error in the `OnComplete` callback, the `IIdentitySystem::Login` call will log the error but otherwise continue as it normally would.
- `OnPostLoginAfterEvents`: After the authentication process completes (not necessarily successfully) as part of `IIdentitySystem::Login`, after the `IIdentitySystem::OnUserSlotChanged` event is fired. This otherwise has the same semantics as `OnPostLoginBeforeEvents`.
- `OnPreLogout`: After `IIdentitySystem::Logout` is called, but before the user is signed out. If you return an error in the `OnComplete` callback, the `IIdentitySystem::Logout` call fails with that error and the user remains signed in. You can use this to prevent logout from starting based on the current game state.
- `OnPreUnexpectedLogout`: Called when the EOS SDK notifies us that the user has been unexpectedly signed out (typically due to an automatic credential refresh failing). This occurs before the user is internally signed out in the plugin, but you will not be able to call any EOS SDK functions at this point, as the user has already been signed out of Epic Online Services. Any error returned from the `OnComplete` callback is ignored, as unexpected logouts can not be cancelled. You can use this callback to notify the local player that they need to sign in again or otherwise return them to the main menu.
- `OnPostLogoutBeforeEvents`/`OnPostLogoutAfterEvents`: These are the logout versions of `OnPostLoginBeforeEvents`/`OnPostLoginAfterEvents` and have the same semantics except that they fire in response to the `IIdentitySystem::Logout` call instead of `IIdentitySystem::Login`.
- `OnStartSystem`: After the user is successfully signed in, or after the logout attempt fails. You can use this hook to start any background systems that need to track local users or perform periodic operations on them. If you return an error in the OnComplete callback, the identity system will log the error but otherwise continue as it normally would.
- `OnStopSystem`: After `IIdentitySystem::Logout` is called and pre-logout hooks have run, but before the user is actually signed out. You should use this if implementing `OnStartSystem` and cease any API calls that use the local user after this hook runs. If you return an error in the OnComplete callback, the identity system will log the error but otherwise continue as it normally would.
- `OnPostCredentialRefresh`: Called when the identity system automatically refreshes credentials for a local player in response to an upcoming credential expiry. For example, when playing on Steam, the EOS SDK requires the plugin to periodically refresh authentication with the EOS backend by providing a new Steam session ticket, and this call is invoked once that credential refresh process completes (not necessarily successfully). If `bWasSuccessful` was true, the authentication attributes of the `FIdentityUser` and the token available on `IOnlineExternalCredentials` may have new values.
- `OnGetAdditionalAuthenticationAttributeKeys`: Called by the identity system to populate authentication attribute keys on `FIdentityUser`. You can use this to dynamically provide authentication attributes for local users so they're visible in other systems.
- `OnGetAdditionalAuthenticationAttributeValue`: Called by the identity system to retrieve the value for authentication attribute keys on `FIdentityUser` that were dynamically added through `OnGetAdditionalAuthenticationAttributeKeys`.
- `OnAuthenticationUserInterfaceRequired`: Called by the identity system to get the `IAuthenticationGraphUserInterface` implementation, which is used by the `RedpointEOSAuth` module to display UI widgets on screen or in XR/VR when the login process has an interactive step. You should not need to override this in a hook as the plugin already provides a hook that implements it.

To register and unregister your hook, you should use `FIdentityHookRegistry` on the startup and shutdown of your game module:

```cpp
class FMyGameModule : public FDefaultModuleImpl
{
private:
    TSharedPtr<IIdentityHook> MyIdentityHook;

public:
    virtual void StartupModule() override
    {
        using namespace ::Redpoint::EOS::Identity;

        this->MyIdentityHook = MakeShared<FMyIdentityHook>();
        FIdentityHookRegistry::RegisterHook(this->MyIdentityHook.ToSharedRef());
    };

    virtual void ShutdownModule() override
    {
        using namespace ::Redpoint::EOS::Identity;

        if (this->MyIdentityHook.IsValid())
        {
            FIdentityHookRegistry::UnregisterHook(this->MyIdentityHook.ToSharedRef());
        }
    }
};
```

To find examples of existing identity hooks, search for `public IIdentityHook` in the plugin source code, as the plugin internally defines several hooks necessary for wiring up various components in response to local users signing in and out.
