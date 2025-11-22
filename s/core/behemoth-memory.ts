
import {GMap} from "@e280/stz"
import {Behemoth} from "./behemoth.js"
import {SetOptions, Hash} from "./types.js"
import {hashBlob} from "./tools/hash-blob.js"
import {Progression} from "./utils/progression.js"

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
		const progress = Progression.blobStorage(blob.size, o?.onProgress)

		const hash = await hashBlob(blob, progress.hashing.set)

		if (!await this.has(hash))
			this.#map.set(hash, blob)

		progress.finish()
		return hash
	}

	async delete(...hashes: Hash[]) {
		for (const hash of hashes)
			this.#map.delete(hash)
	}
}

