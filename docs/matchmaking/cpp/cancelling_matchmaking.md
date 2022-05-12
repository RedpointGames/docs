---
title: Cancelling matchmaking in C++
sidebar_label: Cancelling matchmaking
description: Learn how to cancel a matchmaking request in C++.
---

You'll typically cancel a matchmaking request in response to one of a few things:

- The local player marks themselves as "unready".
- The leader of the party changes or disconnects (and thus who is the "host" and who are "clients" changes).

## Cancelling a matchmaking request

With the `FMatchmakingEngineRequestHandle` you previously stored, you can cancel a matchmaking request like so:

```cpp
IMatchmakingEngine::Get()->Cancel(Request);
```

This doesn't cancel the request immediately, as the matchmaking engine will need to clean up lobbies for the player. The `OnCancelled` callback that you set on the original request will fire once the request has actually been cancelled.

Because some online subsystems limit the number of lobbies you can be in, you should avoid re-queuing a player into matchmaking until the `OnCancelled` callback has been fired.
