---
title: Managing voice chat channels in C++
sidebar_label: The voice chat system
description: Use the voice chat system to manage the state of voice chat from C++.
---

The voice chat system provides a modern API for managing voice chat connections, as well as intercepting audio data for custom effects.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the voice chat system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSVoiceChat` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSVoiceChat",
});
```

## Obtaining the voice chat system

To obtain a reference to the voice chat system, call `GetSystem<IVoiceChatSystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSVoiceChat/VoiceChatSystem.h"

// Place at the top of function bodies that use the voice chat system.
using namespace Redpoint::EOS::Async;
using namespace Redpoint::EOS::VoiceChat;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto VoiceChat = PlatformHandle->GetSystem<IVoiceChatSystem>();
```

:::info
The voice chat system returns `TTask` objects for asynchronous operations. Refer to [Asynchronous APIs and co_await](./async.md) for information on how to use the result of these API calls.
:::

## Voice chat concepts

### Understanding voice chat channels

A voice chat channel contains one or more players, all of whom can speak to each other in the channel. Voice chat channels are also known as "RTC rooms" in the EOS SDK.

Voice chat channels can be managed or unmanaged:

- Managed voice chat channels are handled by the EOS SDK lobby APIs, and are created alongside a lobby. A player must be a member of a lobby to be a member of the associated voice chat channel. Players are connected to the voice chat channel by default, but can leave and re-join the voice chat channel separate to the lobby via `ConnectManagedChannel` and `DisconnectManagedChannel`.
- Unmanaged voice chat channels have credentials issued to them on-demand by dedicated servers via `CreateUnmanagedChannelAuthenticationTokens`. There is no concept of "creating" an unmanaged voice chat channel; you simply issue authentication tokens for the channel name of your choice, and the game clients can then join that channel via `JoinUnmanagedChannel`.

A local player can be in more than one voice chat channel, and each voice chat channel keeps track of all of the members of that voice chat channel. You can control volume and mute settings for the local player globally, for the local player in each voice chat channel, and for each member of each voice chat channel.

### The IVoiceChatChannel object

When you call `GetChannels` or `GetChannel`, you'll be provided with zero or more shared pointers to `IVoiceChatChannel` objects. This represents the voice chat channel and provides access to the following APIs:

- `GetChannelName`: Get the name of this channel that can be used with other APIs.
- `SetInputMuted` / `IsInputMuted`: Sets or gets whether the local user's input (microphone) is currently locally muted in this channel.
- `SetInputVolume` / `GetInputVolume`: Sets or gets the volume of the local user's input (microphone) in this channel, between 0.0 and 200.0.
- `GetInputStatus`: Returns the input status for local user in this channel from the EOS SDK.
- `GetOutputStatus`: Returns the output status for local user in this channel from the EOS SDK.
- `IsUnmanagedChannel`: Returns true if this voice chat channel is an unmanaged channel.
- `GetOwningRoomId`: If this is a managed channel, this is the room ID of the lobby that this voice chat channel is associated with.
- `GetStatisticsJson`: Returns the statistics for this voice chat channel, if available.
- `GetInitialOptions`: Returns the initial options provided by the EOS SDK when joining this unmanaged voice chat channel.

There are also two functions for determining whether or not the local player is currently connected to a voice chat channel:

- `IsConnected`: This indicates whether the local player is actively connected to the voice chat channel. For managed voice chat channels, the EOS SDK will automatically try to reconnect to voice chat channels during intermittent networking errors, so this function can return `true` or `false` depending on whether the user is currently connected. Unmanaged voice chat channels are _not_ automatically rejoined during network disruptions, so this always returns `true`. If an unmanaged voice chat channel is left due to a network disruption, the voice chat channel will no longer be returned from `GetChannels` until you call `JoinUnmanagedChannel` again.
- `IsKeptConnected`: For managed voice chat channels, this indicates whether the EOS SDK will automatically try to keep the local player connected to it. This is the case if the join mode was `AutomaticJoin` when creating or joining the lobby, or if `ConnectManagedChannel` was called after joining the lobby. It will be false if `DisconnectManagedChannel` has been called, or if the join mode was `ManualJoin` when creating or joining the lobby and `ConnectManagedChannel` hasn't been called yet. For unmanaged voice chat channels, this is always `false` because reconnections are not made during network disruptions.

### The IVoiceChatChannelMember object

When you call `GetChannelMembers` or `GetChannelMember`, you'll be provided with zero or more shared pointers to `IVoiceChatChannelMember` objects. These represent the members of the voice chat channel (including the local player), and provide access to the following APIs:

- `GetUserId`: Returns the user ID of this voice chat channel member.
- `SetOutputLocalMuted` / `IsOutputLocalMuted`: Gets or sets whether the remote user's output is currently locally muted in this channel.
- `SetOutputLocalVolume` / `GetOutputLocalVolume`: Sets or gets the volume of the remote user's output in this channel, between 0.0 and 200.0.
- `IsOutputRemoteMuted`: Returns true if this voice chat channel member has been muted for everyone by the server or lobby owner, via `SetChannelMemberHardMute`.
- `GetOutputStatus`: Returns the output status for remote user in this channel from the EOS SDK.
- `IsBlocked`: Returns true if this voice chat channel member has been locally blocked via `BlockChannelMember`.
- `IsSpeaking`: Returns true if this voice chat channel member is currently speaking. There is a delay between someone first starting to speak and when this returns `true`, due to the way the EOS SDK has implemented it.
- `GetMetadata`: Returns metadata about this voice chat channel member from the EOS SDK.

## Get channels that a local user is currently in

To retrieve the list of voice chat channels that a local user is currently in, use `IVoiceChatSystem::GetChannels`:

```cpp
TArray<FVoiceChatChannelRef> Channels = VoiceChat->GetChannels(LocalUserId);
```

You can also get a specific channel by name using `IVoiceChatSystem::GetChannel`:

```cpp
FVoiceChatChannelPtr Channel = VoiceChat->GetChannel(LocalUserId, ChannelName);
if (Channel.IsValid())
{
    // The local user is currently in this channel.
}
```

## Get the list of voice chat channel members

To retrieve the list of voice chat channel members of a voice chat channel that a local user is currently in, use `IVoiceChatSystem::GetChannelMembers`:

```cpp
TArray<FVoiceChatChannelMemberRef> ChannelMembers = VoiceChat->GetChannelMembers(LocalUserId, ChannelName);
```

You can also get a specific channel member by using `IVoiceChatSystem::GetChannelMember`:

```cpp
FVoiceChatChannelMemberPtr ChannelMember = VoiceChat->GetChannelMember(LocalUserId, ChannelName, TargetUserId);
if (ChannelMember.IsValid())
{
    // The target user ID is a member of the voice chat channel.
}
```

## Block or unblock another voice chat channel member

You can block other voice chat channel members for the local player. A blocked member will not be heard by the local player, and the local player's input audio won't be sent to that player.

To block another player, call `IVoiceChatSystem::BlockChannelMember`:

```cpp
FError Result = co_await VoiceChat->BlockChannelMember(LocalUserId, ChannelName, TargetUserId);
if (!Result.WasSuccessful())
{
    // Unable to block channel member.
}
```

To unblock a previously blocked player, call `IVoiceChatSystem::UnblockChannelMember`:

```cpp
FError Result = co_await VoiceChat->UnblockChannelMember(LocalUserId, ChannelName, TargetUserId);
if (!Result.WasSuccessful())
{
    // Unable to unblock channel member.
}
```

## Toggle voice chat audio settings

You can control voice chat audio settings including echo cancellation, noise suppression, auto gain control, discontinuous transmission and hardware-based AEC, by using the `IVoiceChatSystem::SetSetting` and `IVoiceChatSystem::GetSetting` APIs:

```cpp
FError Result = VoiceChat->SetSetting(LocalUserId, EVoiceChatSetting::EnableEchoCancellation, false);
if (!Result.WasSuccessful())
{
    // Unable to toggle setting.
}
```

You can also set some of these settings per voice chat channel by using `IVoiceChatSystem::SetChannelSetting`:

```cpp
FError Result = VoiceChat->SetChannelSetting(LocalUserId, ChannelName, EVoiceChatSetting::EnableEchoCancellation, false);
if (!Result.WasSuccessful())
{
    // Unable to toggle setting.
}
```

## Return the list of available audio devices

You can get the list of available input and output audio devices by calling `IVoiceChatSystem::GetAvailableDevices`:

```cpp
TArray<FVoiceChatDeviceRef> AvailableDevices = VoiceChat->GetAvailableDevices();
for (const auto& AvailableDevice : AvailableDevices)
{
    if (AvailableDevice->IsInputDevice())
    {
        // This is an input device (microphone).
    }
    else
    {
        // This is an output device (speaker or headphone).
    }
}
```

## Set or get the current audio input device

You can set or get the current input device that a local player is using by calling `IVoiceChatSystem::SetInputDevice` and `IVoiceChatSystem::GetInputDevice`:

```cpp
VoiceChat->SetInputDevice(
    LocalUserId,
    Device /* Previously obtained from GetAvailableDevices. */);

FVoiceChatDevicePtr CurrentDevice = VoiceChat->GetInputDevice();
if (!CurrentDevice.IsValid())
{
    // User has no input device; this is only the case when there
    // are no input devices available at all.
}
```

## Set or get the current audio output device

You can set or get the current output device that a local player is using by calling `IVoiceChatSystem::SetOutputDevice` and `IVoiceChatSystem::GetOutputDevice`:

```cpp
VoiceChat->SetOutputDevice(
    LocalUserId,
    Device /* Previously obtained from GetAvailableDevices. */);

FVoiceChatDevicePtr CurrentDevice = VoiceChat->GetOutputDevice();
if (!CurrentDevice.IsValid())
{
    // User has no output device; this is only the case when there
    // are no output devices available at all.
}
```

## Control mute and volume for input and output audio

To control the mute and volume states for input and output audio for the local player, across all voice chat channels, use the following functions:

- `SetInputMuted(LocalUserId, bMuted)`
- `IsInputMuted(LocalUserId)`
- `SetInputVolume(LocalUserId, Volume)`
- `GetInputVolume(LocalUserId)`
- `SetOutputMuted(LocalUserId, bMuted)`
- `IsOutputMuted(LocalUserId)`
- `SetOutputVolume(LocalUserId, Volume)`
- `GetOutputVolume(LocalUserId)`

Volume adjustments you make per voice chat channel, or per voice chat channel member, apply _in addition_ to the volume you set for the local player. This means if you set the local player input volume to 2x (`200.0`), and then the input volume for a voice chat channel to 2x (`200.0`), the resulting volume that other players will hear will be 4x (`400.0`).

:::warning
User-wide output mute and volume settings have no effect on Unreal Engine 5.3, as this engine version does not support dynamically connecting sound submixes together. In Unreal Engine 5.3, audio output from each voice chat channel member is sent straight to the final audio mix.
:::

## Connect to or disconnect from a managed voice chat channel

If the local player is in a managed voice chat channel, and `IVoiceChatChannel::IsKeptConnected` is currently `false`, you can tell the EOS SDK to connect to the voice chat channel again by calling `IVoiceChatSystem::ConnectManagedChannel`:

```cpp
FError Result = co_await VoiceChat->ConnectManagedChannel(
    LocalUserId,
    ChannelName,
    EVoiceChatJoinChannelFlags::None);
```

If the local player is in a managed voice chat channel, and `IVoiceChatChannel::IsKeptConnected` is currently `true`, you can tell the EOS SDK to disconnect from the voice chat channel again by calling `IVoiceChatSystem::DisconnectManagedChannel`:

```cpp
FError Result = co_await VoiceChat->DisconnectManagedChannel(
    LocalUserId,
    ChannelName);
```

## Join or leave an unmanaged voice chat channel

Once a game client has received an authentication token previously issued by `IVoiceChatSystem::CreateUnmanagedChannelAuthenticationTokens` on a dedicated server (typically via Unreal RPCs), you can use that token to join an unmanaged voice chat channel with `IVoiceChatSystem::JoinUnmanagedChannel`:

```cpp
FError Result = co_await VoiceChat->JoinUnmanagedChannel(
    LocalUserId,
    ChannelName,
    ChannelBaseUrl,
    ChannelAuthenticationToken,
    EVoiceChatJoinChannelFlags::None);
```

You can later leave an unmanaged voice chat channel by calling `IVoiceChatSystem::LeaveUnmanagedChannel`:

```cpp
FError Result = co_await VoiceChat->LeaveUnmanagedChannel(
    LocalUserId,
    ChannelName);
```

## Issue unmanaged voice chat channel credentials on dedicated servers

Dedicated servers can not connect to EOS lobbies, and therefore can not use managed voice chat channels. Instead, your dedicated server must issue authentication tokens that game clients can use with `IVoiceChatSystem::JoinUnmanagedChannel` to facilitate voice chat.

To issue authentication tokens for one or more target users, call `IVoiceChatSystem::CreateUnmanagedChannelAuthenticationTokens`:

```cpp
TArray<UE::Online::FAccountId> TargetMemberIds;
TargetMemberIds.Add(...);

FVoiceChatCreatedAuthenticationTokens Tokens = co_await VoiceChat->LeaveUnmanagedChannel(
    LocalUserId,
    TargetMemberIds);

for (const auto& TokenKV : Tokens.ChannelAuthenticationTokens)
{
    FString ChannelName = Tokens.ChannelName;
    FString ChannelBaseUrl = Tokens.ChannelBaseUrl;
    FString ChannelAuthenticationToken = TokenKV.Value;
    UE::Online::FAccountId TargetUserId = TokenKV.Key;

    // Send ChannelName, ChannelBaseUrl and ChannelAuthenticationToken to the
    // TargetUserId over an Unreal RPC (typically via the player controller).
}
```

## Kick a member from an unmanaged voice chat channel

Dedicated servers can kick a member from a voice chat channel they previously issued credentials to by using the `IVoiceChatSystem::KickUnmanagedChannelMember`:

```cpp
FError Error = co_await VoiceChat->KickUnmanagedChannelMember(ChannelName, TargetUserId);
if (!Error.WasSuccessful())
{
    // User could not be kicked.
}
```

## Kick a member from a managed voice chat channel

To kick a member from a managed voice chat channel, kick them from the EOS lobby associated with the voice chat channel. This operation is not done via the voice chat system.

## Hard mute a channel member

To mute a channel member for everyone in a voice chat channel, the dedicated server or owner of the EOS lobby can use `IVoiceChatSystem::SetChannelMemberHardMute`. Before you call this function, check if you have the permissions to hard mute a member using `IVoiceChatSystem::CanHardMuteChannelMember`:

```cpp
if (VoiceChat->CanHardMuteChannelMember(ChannelName, TargetUserId))
{
    FError Error = co_await VoiceChat->SetChannelMemberHardMute(
        ChannelName,
        TargetUserId,
        true /* or false to undo a previous hard mute */);
    if (!Error.WasSuccessful())
    {
        // Could not change hard mute status for this user.
    }
}
```

## Receive a local user's microphone audio on the audio thread

If you want to receive the local user's raw microphone audio before it is processed for voice chat, you can use `IVoiceChatSystem::AddMicrophoneAudioCaptureCallback`. This callback will receive the captured audio on the audio thread, where you can then push it into other Unreal Engine audio systems or perform analysis on it.

Please note that this callback _does not_ allow you to modify the microphone audio for voice chat; you will need to use an [input audio patch](#) if you want to modify the audio data before it is sent to other users in voice chat channels.

```cpp
FVoiceChatMicrophoneAudioCaptureHandleRef Handle = VoiceChat->AddMicrophoneAudioCaptureCallback(
    LocalUserId,
    // Replace with your actual callback:
    FVoiceChatMicrophoneAudioCaptured::CreateLambda([](const FVoiceChatMicrophoneAudio & AudioData) {
    }));

// 'Handle' is a shared pointer. Once it goes out of scope, the callback will no longer be fired, so
// you probably want to assign it as a member of your class that is interested in audio data.
```

## Get the audio volume levels

You can retrieve the audio volume levels and various stages of voice chat audio processing. The [Voice Chat Debugger](/docs/tools/voice_chat_debugger.mdx) uses these APIs to display the audio levels in the editor:

- `GetLastMicrophoneAudioLevels(LocalUserId)`: Reports the last unmodified microphone audio levels, prior to any volume or input patch modifications. This will return the same values for all local users using the same input device.
- `GetLastInputAudioLevels(LocalUserId)`: Reports the last input audio levels, after global volume and mute, and after input patch modifications.
- `GetLastSentAudioLevels(LocalUserId, ChannelName)`: Reports the last sent audio levels for the local user in the specified voice chat channel.
- `GetLastReceivedAudioLevels(LocalUserId, ChannelName, MemberId)`: Reports the last received audio levels for the member in the specified voice chat channel.
- `GetLastOutputAudioLevels(LocalUserId)`: Reports the last output audio levels, after all engine processing, but before the output audio from all local users is mixed together and sent to the output device. This function always reports `0` on Unreal Engine 5.3.
- `GetLastSpeakerAudioLevels(LocalUserId)`: Reports the last speaker audio levels, after all engine processing, right before audio data is sent to the output device.

These functions all return `TArray<float>`; each entry in the array reflects an audio channel (such as 'left speaker' and 'right speaker').

## Listen for events in the voice chat system

The voice chat system provides the following events:

- `OnAvailableDevicesChanged`: The event which fires when the available input and output devices change.
- `OnChannelJoined`: The event which fires when a local player joined a voice chat channel.
- `OnChannelLeft`: The event which fires when a local player leaves a voice chat channel.
- `OnChannelStatisticsUpdated`: The event which fires when the statistics for a voice chat channel changes.
- `OnChannelMemberJoined`: The event which fires when another player joins a voice chat channel that a local player is currently in.
- `OnChannelMemberLeft`: The event which fires when another player leaves a voice chat channel that a local player is currently in.
- `OnChannelMemberSpeakingUpdated`: The event which fires when another player in a voice chat channel starts or stops speaking.
- `OnChannelMemberLocalMuteUpdated`: The event which fires when another player in a voice chat channel is locally muted.
- `OnChannelMemberRemoteMuteUpdated`: The event which fires when another player in a voice chat channel is remotely muted.
- `OnChannelMemberVolumeUpdated`: The event which fires when another player's volume is locally adjusted.

## Using audio patches to intercept audio data

The voice chat system has a powerful audio interception API that allows you to modify and replace both input and output audio data as needed.

There are two types of audio patches:

- Input audio patches, which receive the microphone audio data and can modify it before it is sent to the voice chat channel, and
- Output audio patches, which handle incoming audio data from voice chat channel members and send it to the appropriate Unreal Engine audio system.

Audio patches are registered in their appropriate registry during module startup, and the same audio patch handles requests across all local users and platform handles (including when there are multiple platform handles during play-in-editor scenarios). For this reason, your audio patch information will likely need to track state per platform handle or per user.

:::warning
Implementing an audio patch is an advanced topic and involves PCM data, multi-threaded programming and interacting with Unreal Engine's audio system. We can't provide support in implementing an audio patch, but the API is made available for you to use.
:::

### Registering your audio patch

After declaring your input or output audio patch class, you'll need to register it with the registry when your game module starts up. For example, your implementation may look something like this:

```cpp
using namespace ::Redpoint::EOS::VoiceChat;

class FMyGameModule : public FDefaultModuleImpl
{
private:
    FVoiceChatOutputAudioPatchPtr MyOutputAudioPatch;

public:
    virtual void StartupModule() override
    {
        this->MyOutputAudioPatch = MakeShared<FMyCustomOutputAudioPatch>();
        FVoiceChatOutputAudioPatchRegistry::Register(this->MyOutputAudioPatch.ToSharedRef(), 200 /* priority */);
    }

    virtual void ShutdownModule() override
    {
        if (this->MyOutputAudioPatch.IsValid())
        {
            FVoiceChatOutputAudioPatchRegistry::Unregister(this->MyOutputAudioPatch.ToSharedRef());
            this->MyOutputAudioPatch.Reset();
        }
    }
};
```

The `Priority` parameter when registering your audio patch affects the order that patches are called when processing audio data. A higher priority will be called on the audio data first.

### Handling microphone audio data for input audio patches

When you implement an input audio patch, you'll implement two functions:

```cpp
virtual EVoiceChatAudioPatchResult HandleOnAudioThread(
    const FPlatformHandle &PlatformHandle,
    const UE::Online::FAccountId &LocalUserId,
    const FVoiceChatDeviceRef &AudioDevice,
    const FVoiceChatMicrophoneAudio &AudioData) override;

virtual void PeriodicUpdateOnGameThread() override;
```

`HandleOnAudioThread` is called on the audio thread, with the PCM audio data in `AudioData`. You can modify or replace the audio data by modifying `AudioData->Frames`.

When an input audio patch returns `EVoiceChatAudioPatchResult::Handled`, no further input audio patches have their `HandleOnAudioThread` function called. The audio data set in `AudioData->Frames` is then sent to the voice chat channel.

`PeriodicUpdateOnGameThread` is called periodically from the game thread, and can be used to clean up state you were tracking for previous voice chat channels that no longer exist. A typical implementation for an audio patch will keep a "time last used" value as part of the state, and `PeriodicUpdateOnGameThread` will iterate through the states and release resources where "time last used" is older than a few seconds.

### Handling received audio data for output audio patches

When you implement an output audio patch using `IVoiceChatOutputAudioPatch`, you'll implement two functions:

```cpp
virtual EVoiceChatAudioPatchResult HandleOnAudioThread(
    const FPlatformHandle &PlatformHandle,
    const UE::Online::FAccountId &LocalUserId,
    const UE::Online::FAccountId &MemberId,
    const FVoiceChatDeviceRef &VoiceChatAudioDevice,
    const FAudioDeviceHandle &AudioDeviceHandle,
    USoundSubmixBase *SoundSubmix,
    const FNotifyAudioBeforeRender::Result &AudioData) override;

virtual void PeriodicUpdateOnGameThread() override;
```

`HandleOnAudioThread` is called on the audio thread, with the PCM audio data in `AudioData`. You can modify or replace the audio data by modifying `AudioData->Frames`.

When an output audio patch returns `EVoiceChatAudioPatchResult::Handled`, no further output audio patches have their `HandleOnAudioThread` function called. **If you return `Handled`, you must send the audio data to an Unreal Engine audio system, or the audio won't be heard by the player.** It is expected that the output audio patch routes the PCM data to the appropriate audio system, so if you don't route audio to e.g. a procedural sound wave and you return `EVoiceChatAudioPatchResult::Handled`, then nothing will be heard.

Alternatively, you can modify the data in `AudioData->Frames` and _then_ return `EVoiceChatAudioPatchResult::Unhandled`, allowing another output audio patch to handle sending the audio to the appropriate audio system. This allows you to modify the data without dealing with the complexities of sending audio to an audio device.

`PeriodicUpdateOnGameThread` is called periodically from the game thread, and can be used to clean up state you were tracking for previous voice chat channels that no longer exist. A typical implementation for an audio patch will keep a "time last used" value as part of the state, and `PeriodicUpdateOnGameThread` will iterate through the states and release resources where "time last used" is older than a few seconds.

:::info
`FAbstractSoundWaveOutputAudioPatch` is an abstract implementation of `IVoiceChatOutputAudioPatch`, and is used by `FSpeakerOutputAudioPatch` (the default audio patch).

This abstract implementation provide a simpler API, whereby you can indicate whether you're interested in audio from a given player via `WantsToHandleAudioDataCheckedOnAudioThread`, and handle only the construction of the `UAudioComponent` with `CreateAudioComponentForSoundWave`. The abstract implementation then handles sending audio data to the audio component you constructed.
:::
