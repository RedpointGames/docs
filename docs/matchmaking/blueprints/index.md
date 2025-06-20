---
title: Matchmaking with Blueprints
sidebar_label: Overview
description: Learn how to get started with Matchmaking in Blueprints.
---

Matchmaking provides a high-level, blueprint-based way of doing matchmaking in Unreal Engine. You can also [use C++ if you prefer](../cpp/index.md).

An overview of how blueprint-based matchmaking works is as follows:

- You'll create a subclass of the `Matchmaker` actor, and configure your matchmaking as Class Settings or at runtime on "Begin Play".
- Unlike C++, the blueprint matchmaker automatically tracks which party members are ready, and automatically queues the party into matchmaking when every member is readied up.
- The matchmaker's events like "On Progress" will fire as matchmaking takes place.
- The matchmaker subsystem's events like "On Complete" will fire once the listen server has started or the client has joined the server.
- You can access the user's team and slot information by using the "Get Team and Slot for Player" blueprint node off the matchmaker subsystem, and you can use this on both the server and clients.
- The blueprint-based matchmaker supports a smaller set of configuration options than the C++ APIs. This is because some of the C++ APIs are still experimental, and are not exposed to blueprints until they are stable.

If blueprint-based matchmaking sounds ideal for your project, continue to [Setting up the matchmaker](./matchmaker.mdx).
