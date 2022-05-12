---
title: Converting user IDs from online subsystem types
sidebar_label: Converting user ID types
description: Converting from an FUniqueNetId to UE::Online::FAccountId for use with modern C++ APIs.
---

The online subsystem APIs defined in the engine by Epic Games use the `FUniqueNetId` type to refer to user IDs. This type has now been deprecated by Epic Games and is phased out in favour of `UE::Online::FAccountId`.

In order to call C++ APIs and systems documented in the rest of this section, you'll need to convert from `FUniqueNetId` to the relevant type.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can use the user ID conversion functions, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSCore` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSCore",
});
```

## Including the user ID header

To access the user ID conversion functions, include the relevant header and use the relevant namespace:

```cpp
#include "RedpointEOSCore/Id/Id.h"

using namespace Redpoint::EOS::Core::Id;
```

## Checking user ID validity

To check if a specific `UE::Online::FAccountId` meets a condition, use one of the following functions:

- `IsValidId`: Is the user ID not the value from `GetInvalidAccountId`?
- `IsDedicatedServerId`: Is the user ID the value from `GetDedicatedServerAccountId`?
- `IsProductUserId`: Is the user ID a valid ID that points to a user (not a dedicated server)?

## Serializing and deserializing user IDs to string values

To serialize `UE::Online::FAccountId` to string values, use either:

- `GetUserIdString`: Returns the product user ID as a string, or an empty string if the provided user ID is not valid or if the provided user ID refers to a dedicated server.
- `GetUserIdDebugString`: Returns the product user ID as a string, or a string value suitable for logging indicating whether the user ID is an invalid ID or refers to a dedicated server.

To deserialize a string value back into a `UE::Online::FAccountId`, use:

- `TryParseAccountId`: Returns an `TOptional<UE::Online::FAccountId>`, which is set only if the string passed into this function could be converted back into a user ID.

## Converting between user ID types

To convert between user ID types, use the following functions depending on the source and target type:

| Function name                 | Source type                      | Result type                         |
| ----------------------------- | -------------------------------- | ----------------------------------- |
| `GetProductUserId`            | `UE::Online::FAccountId`         | `EOS_ProductUserId`                 |
| `GetAccountId`                | `FUniqueNetId`                   | `UE::Online::FAccountId`            |
| `GetAccountId`                | `TSharedRef<const FUniqueNetId>` | `UE::Online::FAccountId`            |
| `GetAccountId`                | `EOS_ProductUserId`              | `UE::Online::FAccountId`            |
| `GetDedicatedServerAccountId` | No input parameter               | `UE::Online::FAccountId`            |
| `GetInvalidAccountId`         | No input parameter               | `UE::Online::FAccountId`            |
| `GetUniqueNetId`              | `UE::Online::FAccountId`         | `TSharedPtr<const FUniqueNetIdEOS>` |
| `GetUniqueNetIdRef`           | `UE::Online::FAccountId`         | `TSharedRef<const FUniqueNetIdEOS>` |

## Handling Epic Games account IDs

To convert Epic Games account IDs to string values and back, use one of the following functions:

| Function name              | Source type         | Result type         |
| -------------------------- | ------------------- | ------------------- |
| `GetEpicGamesAccountId`    | `FString`           | `EOS_EpicAccountId` |
| `GetEpicGamesUserIdString` | `EOS_EpicAccountId` | `FString`           |

You should avoid directly using Epic Games account IDs where possible, and instead use the product user ID functions listed in earlier sections as this will keep your game portable to non-EGS stores and platforms.
