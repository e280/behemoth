
import {hex} from "@e280/stz"
import {sha256} from "@noble/hashes/sha2.js"
import {chunks} from "./chunks.js"

/** sha256 hash a blob incrementally and efficiently */
export async function hashBlob(
		blob: Blob,
		onProgress?: (hashed: number) => void,
	) {

	let hashed = 0
	const hasher = sha256.create()

	for await (const chunk of chunks(blob)) {
		hasher.update(chunk)
		hashed += chunk.length
		onProgress?.(hashed)
	}

	return hex.fromBytes(hasher.digest())
}

