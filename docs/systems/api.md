---
title: Using the memory safe EOS SDK APIs provided by the Redpoint plugin
sidebar_label: Using the memory safe EOS SDK APIs
description: How to call the EOS SDK directly, using the memory safe API wrappers provided by the Redpoint plugin.
---

To make the EOS SDK easier to use directly, the Redpoint EOS plugin provides high-level wrappers that manage memory and string marshalling for many of the available EOS SDK functions and events.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Background

The EOS SDK provided by Epic Games is a low-level SDK compatible with C. When you call it, the onus is on you as the caller to manage the lifetime of memory passed into and out of the EOS SDK, as well as perform string marshalling for ASCII and UTF-8 parameters.

While this makes the EOS SDK extremely portable, it also increases the chance of memory leaks and other difficult to debug issues.

## A comparison between the EOS SDK and the RedpointEOSAPI wrappers

For example, to call the `EOS_Lobby_GetRTCRoomName` function in the EOS SDK, you'd typically need to invoke it like so:

```cpp
// Parameters we need to make the call.
FString LobbyId;
EOS_ProductUserId ProductUserId;

// Convert our Unreal Engine string to a `const char*` for the EOS SDK.
auto LobbyIdPtr = StringCast<ANSICHAR>(*LobbyId);

// Set up the call options.
EOS_Lobby_GetRTCRoomNameOptions GetRTCRoomNameOpts = {};
GetRTCRoomNameOpts.ApiVersion = EOS_LOBBY_GETRTCROOMNAME_API_LATEST;
GetRTCRoomNameOpts.LocalUserId = ProductUserId;
GetRTCRoomNameOpts.LobbyId = LobbyIdPtr.Get();

// Initialize buffer parameters just enough that we can call the EOS SDK
// and get it to tell us how much memory we need to allocate.
char* ResultBuffer = nullptr;
uint32_t ResultBufferLength = 0;

// Call the EOS SDK so that it populates ResultBufferLength.
EOS_EResult ResultCode = EOS_Lobby_GetRTCRoomName(
    LobbyHandle,
    &GetRTCRoomNameOpts,
    ResultBuffer,
    &ResultBufferLength);
check(ResultCode == EOS_EResult::EOS_LimitExceeded);

// Allocate our memory to receive the output string.
ResultBuffer = FMemory::MallocZeroed(ResultBufferLength + 1);

// Call the EOS SDK again so it actually populates the output data this time.
ResultCode = EOS_Lobby_GetRTCRoomName(
    LobbyHandle,
    &GetRTCRoomNameOpts,
    ResultBuffer,
    &ResultBufferLength);

// If successful, convert our ASCII string data from the buffer that the
// EOS SDK just populated back into an Unreal Engine string.
FString RTCRoomName;
if (ResultCode == EOS_EResult::EOS_Success)
{
    RTCRoomName = ANSI_TO_TCHAR(ResultBuffer);
}

// Release the temporary memory we allocated for the EOS SDK.
FMemory::Free(ResultBuffer);
```

As clear from the example above, this is a lot of set up and teardown necessary to call just one of the EOS SDK functions. EOS SDK calls which are asynchronous require even more marshalling and memory control to continue execution on a subsequent game frame when the EOS SDK returns a result.

In contrast, the wrapper provided by the `RedpointEOSAPI` module can be invoked like so:

```cpp
#include "RedpointEOSAPI/Lobby/GetRTCRoomName.h"

using namespace Redpoint::EOS::API::Lobby;

// Parameters we need to make the call.
FString LobbyId;
EOS_ProductUserId ProductUserId;

// Result values.
EOS_EResult ResultCode;
FString RTCRoomName;

// Call EOS_Lobby_GetRTCRoomName using the wrapper, with ResultCode and
// RTCRoomName being populated by the call.
FGetRTCRoomName::Execute(
    this->PlatformHandle,
    FGetRTCRoomName::Options{ProductUserId, LobbyId},
    ResultCode,
    RTCRoomName);
```

In addition to simplifying calls to the EOS SDK, the API wrappers provided by the `RedpointEOSAPI` module also trace function call times to Unreal Insights and log all EOS SDK calls at a `VeryVerbose` log level, providing additional diagnostics to track down any issues related to the EOS SDK.

## Locating the RedpointEOSAPI wrapper function for an EOS SDK call

The `RedpointEOSAPI` module exposes a single header file for each EOS SDK function call, and each API wrapper is namespaced. This allows you to include only what you need, and prevents conflicts with type names.

Each EOS SDK function call maps to a wrapper with a consistent naming convention. For example:

- EOS SDK function name: `EOS_Lobby_GetRTCRoomName`
- Header to include: `#include "RedpointEOSAPI/Lobby/GetRTCRoomName.h"`
- Namespace to use: `using namespace Redpoint::EOS::API::Lobby;`
- Type on which `Execute` is provided: `FGetRTCRoomName`

A full list of API wrappers is not listed in the documentation, as more API wrappers are being added in new versions of the plugin are released. Instead, refer to the `RedpointEOSAPI/Public/RedpointEOSAPI` folder inside the Visual Studio Solution Explorer or file browser to see what headers and API calls are available.

## Calling an RedpointEOSAPI wrapper

Please refer to [Obtaining a platform handle](index.md#obtaining-a-platform-handle) to get a platform handle that you can pass to functions in `RedpointEOSAPI`. You can pass the obtained `FPlatformHandle` as the first parameter to most functions.

## Calling the EOS SDK directly

If you need to invoke an EOS SDK function, and we don't yet provide an API wrapper for it, you can get the interface handle directly from the EOS SDK by calling the `Get<>` function on the `FPlatformHandle` like so:

```cpp
FPlatformHandle PlatformHandle = /* ... */;

EOS_HConnect Connect = PlatformHandle->Get<EOS_HConnect>();
if (Connect != nullptr)
{
    // Invoke EOS_Connect_* SDK functions directly.
}
```
