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

### Asynchronous member functions on `UObject` and `TSharedFromThis<>`

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

### Asynchronous static functions

You can use `co_await` in static functions, but you need to indicate the function is static by using `TTask<ReturnType, ETaskBinding::Static>`, like so:

```cpp
TTask<void, ETaskBinding::Static> MyFunction(float Seconds)
{
    // Wait some time using Delay.
    co_await Delay(Seconds);

    // Print out a message.
    UE_LOG(LogTemp, Warning, TEXT("Waiting %f seconds."), Seconds);

    // co_return - always required, even in TTask<void> functions.
    co_return;
}
```

### Asynchronous lambdas

You can use `co_await` in any lambda (capturing and non-capturing), and bind the lifetime of that lambda globally or to a `TSharedPtr` or `UObject` using `Bind`, like so:

```cpp
auto BoundLambda = Bind(
    /**
     * The first argument is the object to bind the lifetime to. Pass in a
     * TSharedFromThis, TSharedPtr, TWeakPtr, TWeakObjectPtr, UObject*, etc...
     *
     * Alternatively, if the lambda isn't capturing 'this', you can omit
     * the first argument and the lambda will be bound to the global lifetime.
     */
    this,
    [this](IUnbound, FString Message) -> TTask<void, ETaskBinding::Unbound>
    {
        // 'this' captured can be safely accessed; the lambda will not continue beyond a co_await
        // if the bound lifetime is no longer valid.

        // Wait some time using Delay.
        co_await Delay(Seconds);

        // Print out a message.
        UE_LOG(LogTemp, Warning, TEXT("Waiting %f seconds, message was %s."), Seconds, *Message);

        // co_return - always required, even in TTask<void> functions.
        co_return;
    });

co_await BoundLambda(TEXT("My message!"));
```

When using `ETaskBinding::Unbound`, the first argument must always be the `IUnbound` type. You can't construct the `IUnbound` type and must use `Bind()` to return the version of the lambda that does not require `IUnbound` to be passed in. This is to ensure that lambdas using `ETaskBinding::Unbound` can't be accidentally used without using `Bind()`.

:::info
You can also use `co_await` in non-capturing lambdas using `ETaskBinding::Lambda`, but we no longer recommend this task binding type because you can't capture locals and you need to perform any lifetime/validity checks manually.
:::

### Running asynchronous code on background threads

You can specify what thread an asynchronous function should run on with a thread task policy as the third parameter to `TTask<>`, like so:

```cpp
TTask<void, ETaskBinding::Static, FBackgroundThreadTaskPolicy> MyFunction(float Seconds)
{
    // Print out a message.
    UE_LOG(LogTemp, Warning, TEXT("This is running on a background thread."));

    // co_return - always required, even in TTask<void> functions.
    co_return;
}
```

Whenever you `co_await` or use `AsCallback` to invoke `MyFunction`, the entire function runs on a background thread per `FBackgroundThreadTaskPolicy`. You do not need to manually schedule the work on a different thread, and the asynchronous task library ensures that the caller of `MyFunction` resumes on it's original thread when `MyFunction` completes.

All types of asynchronous functions, including lambdas bound with `Bind()`, support thread task policies.

The available thread task policies are:

- `FCurrentThreadTaskPolicy`: This is the default when you don't specify a thread task policy, and results in the function running on the same thread as the caller.
- `FGameThreadTaskPolicy`: This function will run on the game thread. If the caller is already running on the game thread, then the function is invoked directly. If the caller is not the game thread, this function will be scheduled to run on the game thread through an internal call to `AsyncTask(ENamedThreads::GameThread, ...)`.
- `FBackgroundThreadTaskPolicy`: This function will run on a worker pool thread. If the caller is already running on a worker pool thread, then this function is invoked directly. If the caller is not a worker pool thread (e.g. it's the game thread), this function will be scheduled to run on the worker pool through an internal call to `AsyncPool(*GThreadPool, ...)`

:::danger
If the caller of an asynchronous function is running on a thread other than the game thread or worker pool, and that asynchronous function uses a thread task policy other than `FCurrentThreadTaskPolicy`, you will get an assertion when the function completes and tries to resume the caller on it's original thread.

This is because `FCurrentThreadTaskPolicy` does not know how to resume work on threads other than the game thread or worker pool (see the `FCurrentThreadTaskPolicy::RunOnDesiredThread` implementation). If you require support for other types of threads, please let support know and we will update `FCurrentThreadTaskPolicy::RunOnDesiredThread` to support your use case.
:::
