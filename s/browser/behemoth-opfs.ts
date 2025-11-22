
import {Behemoth} from "../core/behemoth.js"
import {Hash, SetOptions} from "../core/types.js"
import {hashBlob} from "../core/tools/hash-blob.js"
import {progression} from "../core/utils/progression.js"
import {writeBlobToOpfs} from "./utils/write-blob-to-opfs.js"
import {getOpfsFileHandle} from "./utils/get-opfs-file-handle.js"

export class BehemothOpfs extends Behemoth {
	static async mkdir(name: string) {
		const root = await navigator.storage.getDirectory()
		const directory = await root.getDirectoryHandle(name, {create: true})
		return new this(directory)
	}

	#directory: FileSystemDirectoryHandle

	constructor(directory: FileSystemDirectoryHandle) {
		super()
		this.#directory = directory
	}

	async has(hash: Hash) {
		return !!await getOpfsFileHandle(this.#directory, hash)
	}

	async require(hash: Hash) {
		const handle = await this.#directory.getFileHandle(hash)
		return handle.getFile()
	}

	async get(hash: Hash) {
		const handle = await getOpfsFileHandle(this.#directory, hash)
		return handle?.getFile()
	}

	async set(blob: Blob, o?: SetOptions) {
		const progress = progression(blob.size * 2, o?.onProgress)

		const hash = await hashBlob(blob, progress.add)

		if (!await this.has(hash))
			await writeBlobToOpfs(blob, this.#directory, hash, progress.add)

		progress.done()
		return hash
	}

	async delete(...hashes: Hash[]) {
		await Promise.all(hashes.map(async hash => {
			try {
				await this.#directory.removeEntry(hash)
			}
			catch (error) {
				if (error instanceof Error && error.name === "NotFoundError")
					return
				throw error
			}
		}))
	}
}

