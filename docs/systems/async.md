---
title: Using co_await and TTask for asynchronous programming in C++
sidebar_label: Asynchronous APIs and co_await
description: How to use co_await, TTask and AsCallback to access asynchronous APIs.
---

To simplify asynchronous programming in C++, the Redpoint EOS Online Framework provides `TTask<>` via the `RedpointEOSAsync` module. Many of the newer C++ APIs return a `TTask<>` so that you can use `co_await`.

`TTask<>` is analogous to the `await`/`async` support that exists in C#, and is designed to be very similar in behaviour.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the asynchronous types, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSAsync` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSAsync",
});
```

For all of these APIs, you will need to include the correct headers and the appropriate namespace:

```cpp
#include "RedpointEOSAsync/Task.h"

using namespace ::Redpoint::EOS::Async;
```

## Awaiting a task

When a C++ function returns `TTask<>`, you can use `co_await` to asynchronously wait for the result. You can only use `co_await` if the function you are using it in [also returns `TTask<>`](#writing-asynchronous-functions-with-ttask):

```cpp
// Assuming Hello() is declared as:
//
// TTask<int32> Hello();

int32 Result = co_await Hello();
```

## Handling a task as a callback

If you are writing a function that is not returning `TTask<>`, and you want to handle the result of a `TTask<>` as a callback, you can use the `AsCallback` function:

```cpp
// Assuming Hello() is declared as:
//
// TTask<int32> Hello();

AsCallback(
    Hello(),
    [](int32 Result)
    {
        // Use 'Result' on potentially a different frame.
    });
```

## Creating a deferred task

If you want to return a `TTask<>` from a function, but need to interact with code that uses callbacks, you can create a "deferred task" and return it. A deferred task is one that promises to have a result at a later point in time.

For example, the implementation of `Delay` looks like this:

```cpp
TTask<void> Delay(float Seconds)
{
    auto Deferred = TTask<void>::Deferred();
    FTSTicker::GetCoreTicker().AddTicker(
        FTickerDelegate::CreateLambda([Deferred](float) -> bool {
            Deferred.SetValue();
            return false;
        }),
        Seconds);
    return Deferred;
}
```

With this function, callers can use `co_await` to wait some amount of time:

```cpp
co_await Delay(1.0f); // Wait 1 second.
```

## Writing asynchronous functions with `TTask<>`

To write asynchronous functions, your function needs to return a `TTask<>`. If you don't have a return value (where you would use `void`), then the return type should be `TTask<void>`. Otherwise, you would use `TTask<TypeToReturn>`.

There are some limitations as to when you can use `TTask<>` as a return value, and this is because the lifetime of memory in C++ is manually managed.

You can use `TTask<>` directly when your function is declared on a class that inherits from `UObject`, `TSharedFromThis<>`, or [returns a deferred task](#creating-a-deferred-task) (and doesn't call `co_await`):

```cpp
UCLASS()
class AMyActor : public AActor
{
    // ...

public:
    TTask<int32> MyAsyncFunction(FString Hello);
};

TTask<int32> AMyActor::MyAsyncFunction(FString Hello)
{
    // Safe to use co_await.
    co_return (co_await SomeOtherFunction());
}
```

```cpp
class FMySharedObject : public TSharedFromThis<FMySharedObject>
{
public:
    TTask<int32> AnotherAsyncFunction(FString Hello);
};

TTask<int32> FMySharedObject::AnotherAsyncFunction(FString Hello)
{
    // Safe to use co_await.
    co_return (co_await SomeOtherFunction());
}
```

In the cases above, if `AMyActor` is garbage collected, or `FMySharedObject` is released, then the asynchronous functions will not continue past the `co_await`. Effectively, if the object the asynchronous function is associated with is released, the asynchronous functions stop running the next time they are able and will never return. Any code that is `co_await`ing a task returned by a released object will never continue either.

:::warning
All functions that use `co_await` must pass parameters by value. You can not pass by `const&`, as only the reference will be captured for the asynchronous stack frame, and not the value. You will receive a compiler error if you try to use `co_await` in a function with a `const&` parameter.
:::

:::warning
All functions using `TTask<>`, even those using `TTask<void>`, must call `co_return` when returning from the function. This is required for the compiler to generate correct return code.
:::

You can also use `co_await` in static functions, but you need to indicate the function is static by using `::With<ETaskBinding::Static>`, like so:

```cpp
TTask<void>::With<ETaskBinding::Static> MyFunction(float Seconds)
{
    // Wait some time using Delay.
    co_await Delay(Seconds);

    // Print out a message.
    UE_LOG(LogTemp, Warning, TEXT("Waiting %f seconds."), Seconds);

    // co_return - always required, even in TTask<void> functions.
    co_return;
}
```

You can also use `co_await` in lambda functions, but the **lambda functions must not have any captures**, and you need to indicate the function is a lambda using `::With<ETaskBinding::Lambda>`:

```cpp
auto MyLambda = [](float Seconds) -> TTask<void>::With<ETaskBinding::Lambda>
    {
        // Wait some time using Delay.
        co_await Delay(Seconds);

        // Print out a message.
        UE_LOG(LogTemp, Warning, TEXT("Waiting %f seconds."), Seconds);

        // co_return - always required, even in TTask<void> functions.
        co_return;
    };
AsCallback(
    MyLambda(),
    []()
    {
        // Optionally, do something after the lambda finishes.
    });
```

:::warning
Using lambdas with `TTask<>` is not recommended, since we can't automatically stop the asynchronous work when associated memory is released. It's always better to declare the function on a `UObject` or `TSharedFromThis`.
:::
