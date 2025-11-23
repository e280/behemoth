
import {hex} from "@e280/stz"
import fs from "node:fs/promises"
import {sha256} from "@noble/hashes/sha2.js"
import {readBlob} from "../../core/tools/readers.js"

export async function hashAndWriteFile(
		blob: Blob,
		filepath: string,
		onProgress: (n: number) => void,
	) {

	let progress = 0
	onProgress(progress)

	const hasher = sha256.create()
	const file = await fs.open(filepath, "w")

	try {
		for await (const chunk of readBlob(blob)) {
			hasher.update(chunk)
			await file.write(chunk)
			progress += chunk.length
			onProgress(progress)
		}
		return hex.fromBytes(hasher.digest())
	}
	finally {
		await file.close()
	}
}

