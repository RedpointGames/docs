---
title: Introduction to EOS-specific C++ APIs and systems
sidebar_label: Introduction
description: How to access C++ APIs and systems specific to the Redpoint EOS Online Framework plugin.
---

The Redpoint EOS plugin provides additional C++ APIs and systems that are specific to Epic Online Services. You can use these C++ APIs in your game code, but note that they are more likely to change between plugin releases than the online subsystem APIs provided by the engine.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## The EOS SDK platform handle

To use any of the APIs described in this section, you'll need to get access to the _platform handle_. Each platform handle is associated with a platform instance of the EOS SDK, and there may be multiple platform instances depending on the situation:

- For testing in the editor, there is a platform instance for each play-in-editor window.
- For packaged games, there is a single platform handle across the whole process.
- For automation tests internal to the Redpoint EOS plugin, there may be one or more instances per test.

The platform handle type is `Redpoint::EOS::API::FPlatformHandle`. The type underneath is `TSharedRef<Redpoint::EOS::API::FPlatformInstance>`, so you do not need to reference count `FPlatformHandle` and you can safely pass it around as a value on the stack or heap.

When the platform handle has `ForceShutdown()` called on it, the EOS SDK platform instance that it internally references is shutdown and the memory associated with it is released. This typically happens when the Redpoint EOS online subsystem shuts down during game exit or when exiting play-in-editor.

A platform handle is still safe to use after shutdown, as all API calls in `RedpointEOSAPI` gracefully detect a released platform handle and return an `EOS_EResult::EOS_NoConnection` instead of calling the EOS SDK. Thus, you never need to call `IsShutdown()` yourself - it is always safe to call APIs and systems regardless of the state of the game.

## Updating your game module dependencies

Before you can reference the `FPlatformHandle` type, you need to update your game module's `.Build.cs` file to depend on the Redpoint-specific modules, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSAPI",
});
```

If you have multiple game modules, or want to expose the `FPlatformHandle` type in public headers of your module, you should add `RedpointEOSAPI` to `PublicDependencyModuleNames` instead.

## Obtaining a platform handle

The most typical way of obtaining a platform handle is to get the platform handle that already exists for the current world. To do so, add a dependency on `RedpointEOSCore` to your `.Build.cs` file:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "OnlineSubsystem",
    "OnlineSubsystemUtils",
    "RedpointEOSCore",
});
```

Then, access it through the world resolution API:

```cpp
#include "RedpointEOSCore/Utils/WorldResolution.h"
#include "RedpointEOSAPI/Platform.h"

// ...

void UMyClass::YourFunction()
{
    using namespace ::Redpoint::EOS::API;
    using namespace ::Redpoint::EOS::Core::Utils;

    TSharedPtr<FPlatformInstance> MaybePlatformHandle = FWorldResolution::TryGetPlatformHandle(this->GetWorld());
    if (MaybePlatformHandle.IsValid())
    {
        FPlatformHandle PlatformHandle = MaybePlatformHandle.ToSharedRef();

        // You can now store PlatformHandle in a field, use it with RedpointEOSAPI calls, etc.
    }
}
```

:::info
If you're certain you're running in a context where the platform handle is available (i.e. an actor that can only be present after the user has successfully signed in), you can use `FPlatformHandle PlatformHandle = FWorldResolution::GetPlatformHandle(this->GetWorld())` instead, and skip the `.IsValid()` check. If you use `GetPlatformHandle` and the platform handle isn't available, the function call will assert.
:::

## Creating a platform instance

For scenarios such as automated testing, you may want to create your own platform instance and manage its lifecycle.

:::caution
You should never need to create your own EOS SDK platform instance in game code. Instead, refer to "[Obtaining a platform handle](#obtaining-a-platform-handle)" above.
:::

First, add a dependency on `RedpointEOSCore` to your `.Build.cs`:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSCore",
});
```

Then, use the `IInstancePool` API:

```cpp
#include "RedpointEOSAPI/Platform.h"
#include "RedpointEOSCore/InstancePool.h"

// ...

void UMyClass::YourFunction()
{
    using namespace Redpoint::EOS::API;
    using namespace Redpoint::EOS::Core;

    // To create an instance using the Project Settings configuration:
    FPlatformRefCountedHandle DefaultCreate = IInstancePool::Pool().Create(FName(TEXT("UniqueInstanceName")));

    // To create an instance using custom configuration, where YourCustomConfig
    // is a shared pointer to an object that implements Redpoint::EOS::Config::IConfig.
    FPlatformRefCountedHandle CustomCreate = IInstancePool::Pool().CreateWithConfig(
        FName(TEXT("AnotherUniqueInstanceName")),
        YourCustomConfig);
}
```

The `FPlatformRefCountedHandle` type is an additional layer of reference counting around `FPlatformHandle`. When the last `FPlatformRefCountedHandle` instance is released, it will call `ForceShutdown` on the platform handle to release it. This allows the lifetime of `FPlatformHandle` and the lifetime of the underlying EOS SDK to be independent of one another, and to allow the online subsystem implementation to control when the platform instance is shutdown, even if game code continues to hold `FPlatformHandle` references in memory.
