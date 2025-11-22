
import path from "node:path"
import fs from "node:fs/promises"

import {Behemoth} from "../core/behemoth.js"
import {readBlob} from "../core/tools/readers.js"
import {Hash, SetOptions} from "../core/types.js"
import {hashBlob} from "../core/tools/hash-blob.js"
import {writeToFile} from "./utils/write-to-file.js"
import {progression} from "../core/utils/progression.js"

export class BehemothDisk extends Behemoth {
	static async mkdir(path: string) {
		await fs.mkdir(path, {recursive: true})
		return new this(path)
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
		const progress = progression(blob.size * 2, o?.onProgress)

		const hash = await hashBlob(blob, progress.add)

		if (!await this.has(hash))
			await writeToFile(this.#path(hash), readBlob(blob), progress.add)

		progress.done()
		return hash
	}

	async delete(...hashes: Hash[]) {
		try {
			await Promise.all(
				hashes.map(hash => fs.unlink(this.#path(hash)))
			)
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

