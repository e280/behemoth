
import path from "node:path"
import fs from "node:fs/promises"

import {Behemoth} from "../../core/behemoth.js"
import {smartHash} from "../../tools/smart-hash.js"
import {Hash, SetOptions} from "../../core/types.js"
import {progression} from "../../tools/progress-helpers.js"
import {writeBlobToFile} from "../../tools/write-blob-to-file.js"

export class BehemothDisk extends Behemoth {
	static async make(dirpath: string) {
		await fs.mkdir(dirpath, {recursive: true})
		return new this(dirpath)
	}

	#dirpath: string

	constructor(dirpath: string) {
		super()
		this.#dirpath = dirpath
	}

	#path(hash: Hash) {
		return path.join(this.#dirpath, hash)
	}

	async has(hash: Hash) {
		try {
			await fs.access(this.#path(hash))
			return true
		}
		catch {
			return false
		}
	}

	async set(blob: Blob, o?: SetOptions) {
		const progress = progression(blob.size, o?.onProgress)
		progress.start()

		const hash = await smartHash(blob, progress.hashing)

		if (!await this.has(hash))
			await writeBlobToFile(this.#path(hash), blob, progress.storing)

		progress.done()
		return hash
	}

	async delete(hash: Hash) {
		try {
			await fs.unlink(this.#path(hash))
		}
		catch (err: any) {
			if (err?.code !== "ENOENT") throw err
		}
	}

	async require(hash: Hash) {
		const buffer = await fs.readFile(this.#path(hash))
		return new Blob([buffer])
	}

	async get(hash: Hash) {
		try {
			return await this.require(hash)
		}
		catch (err: any) {
			if (err.code === "ENOENT") return undefined
			throw err
		}
	}
}

