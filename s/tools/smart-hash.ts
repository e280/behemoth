
import {hex} from "@e280/stz"
import {sha256} from "@noble/hashes/sha2.js"
import {chunks} from "./chunks.js"

/** sha-256 hash a blob incrementally and efficiently */
export async function smartHash(blob: Blob) {
	const hasher = sha256.create()

	for await (const chunk of chunks(blob))
		hasher.update(chunk)

	return hex.fromBytes(hasher.digest())
}

