
import {readBlob} from "../../core/tools/readers.js"
import {Hash} from "../../core/types.js"

export async function writeBlobToOpfs(
		blob: Blob,
		directory: FileSystemDirectoryHandle,
		hash: Hash,
		onProgress: (n: number) => void,
	) {

	let stored = 0
	onProgress(stored)

	const handle = await directory.getFileHandle(hash, {create: true})
	const writable = await handle.createWritable()

	for await (const chunk of readBlob(blob)) {
		await writable.write(chunk as FileSystemWriteChunkType)
		stored += chunk.length
		onProgress(stored)
	}

	await writable.close()
}

