
import {GMap} from "@e280/stz"
import {Hash} from "../core/types.js"
import {Behemoth} from "../core/behemoth.js"
import {smartHash} from "../tools/smart-hash.js"

export class BehemothMemory extends Behemoth {
	#map = new GMap<Hash, Blob>()

	async has(hash: Hash) {
		return this.#map.has(hash)
	}

	async set(blob: Blob) {
		const hash = await smartHash(blob)
		const exists = await this.has(hash)
		if (!exists) this.#map.set(hash, blob)
		return hash
	}

	async delete(hash: Hash) {
		this.#map.delete(hash)
	}

	async require(hash: Hash) {
		return this.#map.require(hash)
	}

	async get(hash: Hash) {
		return this.#map.get(hash)
	}
}

