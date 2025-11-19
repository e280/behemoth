
import {GMap} from "@e280/stz"
import {Behemoth} from "../core/behemoth.js"
import {SetOptions, Hash} from "../core/types.js"
import {smartHash} from "../tools/smart-hash.js"
import {progression} from "../tools/progress-helpers.js"

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
		const progress = progression(blob.size, o?.onProgress)
		progress.start()

		const hash = await smartHash(blob, progress.hashing)

		if (!await this.has(hash))
			this.#map.set(hash, blob)

		progress.done()
		return hash
	}

	async delete(hash: Hash) {
		this.#map.delete(hash)
	}
}

