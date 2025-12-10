---
title: Reading and writing files in Player Data Storage and Title Storage
sidebar_label: The storage system
description: Using the storage system to read files from Player Data Storage and Title Storage, and to write files to Player Data Storage.
---

The storage system provides a common API for reading and writing files to the Player Data Storage and Title Storage features of Epic Online Services. It ensures that file operations happen atomically, preventing partial writes and data loss.

:::info
The C++ APIs described in this section are only available in the Paid Edition, as the Free Edition does not ship with any C++ headers.
:::

## Updating your game module dependencies

Before you can access the storage system, you need to update your game module's `.Build.cs` file to depend on the `RedpointEOSStorage` module, like so:

```csharp
PrivateDependencyModuleNames.AddRange(new string[]
{
    "RedpointEOSStorage",
});
```

## Obtaining the storage system

To obtain a reference to the storage system, call `GetSystem<IStorageSystem>` on [an `FPlatformHandle` you previously obtained](./index.md):

```cpp
#include "RedpointEOSStorage/StorageSystem.h"

// Place at the top of function bodies that use the storage system.
using namespace Redpoint::EOS::Storage;

FPlatformHandle PlatformHandle; // e.g. obtained from the online subsystem.
auto Storage = PlatformHandle->GetSystem<IStorageSystem>();
```

## The FFileEntry type

When you list files from Player Data Storage or Title Storage, each file is represents by an `FFileEntry`. This structure contains all the metadata about files provided by Epic Online Services:

- `FileSizeBytes`: The size of the file in bytes. This measures the amount of storage taken up by the file in Player Data Storage or Title Storage, including any metadata.
- `MD5Hash`: The MD5 hash of the file.
- `FilePath`: The file path that should be used when reading or writing this file.
- `LastModifiedTime`: The last time this file was modified, if available. The last modified time is not available when listing files in Title Storage.
- `UnencryptedDataSizeBytes`: The original size of the file when it was uploaded.

## Listing files

To list files from Player Data Storage or Title Storage:

```cpp
Storage->List(
    /* Optional; not required if reading from Title Storage and no user is signed in. */
    LocalUserId,
    EStorageType::PlayerDataStorage /* Or TitleStorage */,
    /* If reading from Title Storage, this is a list of tags to list. If empty, defaults to "Default". */
    TArray<FString>(),
    IStorageSystem::FOnSetPresenceComplete::CreateSPLambda(this, [this](const FError &ErrorCode, const TArray<FFileEntry> &FileList) {
        if (ErrorCode.WasSuccessful())
        {
            // Iterate through FileList to see all the available files.
        }
    }));
```

## Reading a file all at once

To read the entire contents of a file in a single call, use `Read`:

```cpp
Storage->Read(
    /* Optional; not required if reading from Title Storage and no user is signed in. */
    LocalUserId,
    EStorageType::PlayerDataStorage /* Or TitleStorage */,
    TEXT("MyFile.txt"),
    IStorageSystem::FOnReadComplete::CreateSPLambda(this, [this](const FError &ErrorCode, const TArray<uint8> &FileData) {
        if (ErrorCode.WasSuccessful())
        {
            // The file data is available in FileData.
        }
    }),
    /* Optional callback that indicates read progress. */
    IStorageSystem::FOnOperationProgress::CreateSPLambda(this, [this](uint32 BytesTransferred, uint32 TotalFileSizeBytes) {
        // % = BytesTransferred / TotalFileSizeBytes
    }));
)
```

## Writing a file all at once

To write the entire contents of a file in a single call, use `Write`. You can only write files to Player Data Storage, so there is no `EStorageType` argument, and you must have a local user ID present.

```cpp
Storage->Write(
    LocalUserId
    TEXT("MyFile.txt"),
    // Replace with a variable containing your file data.
    TArray<uint8>(),
    IStorageSystem::FOnWriteComplete::CreateSPLambda(this, [this](const FError &ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // The file was written successfully.
        }
    }),
    /* Optional callback that indicates write progress. */
    IStorageSystem::FOnOperationProgress::CreateSPLambda(this, [this](uint32 BytesTransferred, uint32 TotalFileSizeBytes) {
        // % = BytesTransferred / TotalFileSizeBytes
    }));
```

## Deleting a file

To delete a file from Player Data Storage, use `Delete`:

```cpp
Storage->Write(
    LocalUserId
    TEXT("MyFile.txt"),
    IStorageSystem::FOnDeleteComplete::CreateSPLambda(this, [this](const FError &ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // The file was written successfully.
        }
    }));
```

## Read a file as a stream of data

If you have exceptionally large amounts of data, or if you want to be able to cancel the download of a file after partially reading it, you can read the file in a stream of chunks using `ReadStream`:

```cpp
auto Operation = Storage->ReadStream(
    /* Optional; not required if reading from Title Storage and no user is signed in. */
    LocalUserId,
    EStorageType::PlayerDataStorage /* Or TitleStorage */,
    TEXT("MyFile.txt"),
    IStorageSystem::FOnReadChunk::CreateSPLambda(this, [this](const TArray<uint8> &ChunkData, uint32 TotalFileSizeBytes, bool bIsLastChunk) -> EReadStreamAction {
        // Received another chunk of data.
        //
        // Return EReadStreamAction::Continue if reading should continue.
        // Return EReadStreamAction::Fail if reading should stop and the read operation should count as a failure.
        // Return EReadStreamAction::Cancel if reading should stop (but not due to an error).
    }),
    IStorageSystem::FOnReadStreamComplete::CreateSPLambda(this, [this](const FError &ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // The file read completed successfully.
        }
    }),
    /* Optional callback that indicates read progress. */
    IStorageSystem::FOnOperationProgress::CreateSPLambda(this, [this](uint32 BytesTransferred, uint32 TotalFileSizeBytes) {
        // % = BytesTransferred / TotalFileSizeBytes
    }));

// If you want to cancel the read from other code (i.e. outside of the 'OnReadChunk' callback), you
// can store the returned operation and call CancelOperation. This is useful if you want to cancel the
// read prior to the EOS SDK returning another chunk of data.
Storage->CancelOperation(Operation);
```

## Write a file as a stream of data

If you have exceptionally large amounts of data, or if you want to be able to cancel the upload of a file after it has been partially uploaded, you can write the file in a stream of chunks using `WriteStream`:

```cpp
auto Operation = Storage->WriteStream(
    LocalUserId,
    TEXT("MyFile.txt"),
    IStorageSystem::FOnWriteChunk::CreateSPLambda(this, [this](TArray<uint8> &ChunkData) -> EWriteStreamAction {
        // Called by the EOS SDK when it needs the next chunk of data. You should populate
        // ChunkData with the next chunk of data to be written.
        //
        // Return EWriteStreamAction::Continue if there is more data to upload after this chunk.
        // Return EWriteStreamAction::Complete if this is the last chunk of data to upload.
        //
        // Return EWriteStreamAction::Fail if writing should stop and the write operation should count as a failure.
        // Return EWriteStreamAction::Cancel if writing should stop (but not due to an error).
    }),
    IStorageSystem::FOnWriteStreamComplete::CreateSPLambda(this, [this](const FError &ErrorCode) {
        if (ErrorCode.WasSuccessful())
        {
            // The file write completed successfully.
        }
    }),
    /* Optional callback that indicates write progress. */
    IStorageSystem::FOnOperationProgress::CreateSPLambda(this, [this](uint32 BytesTransferred, uint32 TotalFileSizeBytes) {
        // % = BytesTransferred / TotalFileSizeBytes
    }));

// If you want to cancel the write from other code (i.e. outside of the 'OnWriteChunk' callback), you
// can store the returned operation and call CancelOperation. This is useful if you want to cancel the
// write prior to the EOS SDK requesting another chunk of data.
Storage->CancelOperation(Operation);
```

:::info
Writes to Player Data Storage through the EOS Online Framework plugin are always atomic. If you cancel a write operation or a file is partially uploaded, the previous version of the file remains available.
:::
