
import {hex} from "@e280/stz"
import path from "node:path"
import fs from "node:fs/promises"

import {Behemoth} from "../core/behemoth.js"
import {Hash, SetOptions} from "../core/types.js"
import {progress} from "../core/tools/progress.js"
import {hashAndWriteFile} from "./utils/hash-and-write.js"

export class BehemothDisk extends Behemoth {
	static async mkdir(dir: string) {
		const tempDir = path.join(dir, "temp")
		await fs.mkdir(tempDir, {recursive: true})
		return new this(dir, tempDir)
	}

	#directory: string
	#tempDirectory: string

	constructor(directory: string, tempDirectory: string) {
		super()
		this.#directory = directory
		this.#tempDirectory = tempDirectory
	}

	#path(hash: Hash) {
		return path.join(this.#directory, hash)
	}

	#pathTemp(name: string) {
		return path.join(this.#tempDirectory, name)
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
		const tempId = hex.random()
		const tempPath = this.#pathTemp(tempId)

		const hash = await hashAndWriteFile(
			blob,
			tempPath,
			progress(blob.size, o?.onProgress),
		)

		if (await this.has(hash))
			await fs.rm(tempPath, {force: true})
		else
			await fs.rename(tempPath, this.#path(hash))

		return hash
	}

	async delete(...hashes: Hash[]) {
		await Promise.all(hashes.map(async hash => {
			try {
				await fs.unlink(this.#path(hash))
			}
			catch (err: any) {
				if (err?.code !== "ENOENT")
					throw err
			}
		}))
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

