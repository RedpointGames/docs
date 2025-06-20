---
title: Matchmaking with C++
sidebar_label: Overview
description: Learn how to get started with Matchmaking in C++.
---

Matchmaking provides a low-level C++ API that you can use to do team-based matchmaking. You can also [use blueprints if you prefer](../blueprints/index.md).

An overview of how C++ matchmaking works as follows:

- You'll get an instance of the matchmaking engine by calling `IMatchmakingEngine::Get()`.
- You'll create your request and optionally host configuration (for the party leader), and then enqueue your request into the matchmaking engine.
  - Your request configuration also includes references to the OnProgress and OnComplete events that you want to fire as matchmaking progresses.
- You'll need to track when players are ready in the party, and enqueue/cancel requests as needed. Unlike blueprint-based matchmaking, the C++ APIs do not track party status for you.
- The OnComplete callback for the matchmaking request will always fire, even after map loads.
- To access the team and slot information of players at runtime, you'll need to store the matchmaking results in your game somewhere and access them via your own storage. The "Get Team and Slot for Player" blueprint nodes will not work, as these only work with the blueprint matchmaker.
- The C++ APIs support the full set of options, including experimental options that might change in the future.

If C++ matchmaking sounds ideal for your project, continue to [Queue into matchmaking](../cpp/queue_to_matchmaking.md).
