
import {GMap} from "@e280/stz"
import {Behemoth} from "./behemoth.js"
import {SetOptions, Hash} from "./types.js"
import {progress} from "./tools/progress.js"
import {hashBlob} from "./tools/hash-blob.js"

export class BehemothMemory extends Behemoth {
	#map = new GMap<Hash, Blob>()

	async has(hash: Hash) {
		return this.#map.has(hash)
	}

	async require(hash: Hash) {
		return this.#map.require(hash)
	}

	async get(hash: Hash) {
		return this.#map.get(hash)
	}

	async set(blob: Blob, o?: SetOptions) {
		const hash = await hashBlob(blob, progress(blob.size, o?.onProgress))

		if (!await this.has(hash))
			this.#map.set(hash, blob)

		return hash
	}

	async delete(...hashes: Hash[]) {
		for (const hash of hashes)
			this.#map.delete(hash)
	}
}

