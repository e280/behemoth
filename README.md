
![](https://i.imgur.com/tqdllUN.png)

# ***BEHEMOTH***
> *hashed blob storage. on opfs. in memory. on disk. in orbit.*

- 🗿 **behemoth stores binary data, anywhere.**
- 🔒 content-addressable -- sha256 hashes for identity (never store a dupe)
- 🔮 blob-oriented -- blobs provide random-access and are generally super cool


<br/>

### 🐉 abstract Behemoth
> *all behemoths have the same shape*

**Behemoth**
- **`.has(hash: Hash): Promise<boolean>`**
    ```ts
    await behemoth.has(hash)
    ```
- **`.require(hash: Hash): Promise<Blob>`**
    ```ts
    const blob = await behemoth.require(hash)
    ```
- **`.get(hash: Hash): Promise<Blob | undefined>`**
    ```ts
    const blob = await behemoth.get(hash)
    ```
- **`.set(blob: Blob, options?: SetOptions): Promise<Hash>`**
    ```ts
    const hash = await behemoth.set(blob)
    ```
    ```ts
    const hash = await behemoth.set(blob, {onProgress: progress => {
      progress.phase // "hashing" | "storing"
      progress.size // number of bytes in this blob
      progress.hashed // how many bytes have been hashed
      progress.stored // how many bytes have been stored
    }})
    ```
- **`.delete(hash: Hash): Promise<void>`**
    ```ts
    await behemoth.delete(hash)
    ```


<br/>

### 🐉 BehemothOpfs
> *store data in the browser's [origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)*

```ts
import {BehemothOpfs} from "@e280/behemoth"

const behemoth = await BehemothOpfs.directory("my-data")
```


<br/>

### 🐉 BehemothDisk
> *store data to disk via node fs*

```ts
import {BehemothDisk} from "@e280/behemoth/node"
 //                                         👆

const behemoth = await BehemothDisk.directory("./my-data")
```


<br/>

### 🐉 BehemothMemory
> *store data in memory*

```ts
import {BehemothMemory} from "@e280/behemoth"

const behemoth = new BehemothMemory()
```

<br/>

### 🐉 tools
> *handy tools you might wanna use*

- **`hashBlob(blob: Blob, onProgress: (hashed: number) => void): Promise<Hash>`**
  ```ts
  const hash = await hashBlob(blob)
  ```
  ```ts
  const hash = await hashBlob(blob, hashed => {
    console.log(`bytes hashed: ${hashed}`)
  })
  ```
- **`readBlob(blob: Blob): AsyncGenerator<Uint8Array>`**
  ```ts
  for await (const chunk of readBlob(blob))
    chunk
  ```
- **`readStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array>`**
  ```ts
  for await (const chunk of readStream(stream))
    chunk
  ```


<br/><br/>

## 🧑‍💻 open source
[e280.org](https://e280.org/), github stars plz

