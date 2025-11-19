
import {Behemoth} from "../core/behemoth.js"
import {smartHash} from "../core/tools/smart-hash.js"
import {Hash, SetOptions} from "../core/types.js"
import {progression} from "../core/utils/progression.js"
import {writeBlobToOpfs} from "./utils/write-blob-to-opfs.js"
import {getOpfsFileHandle} from "./utils/get-opfs-file-handle.js"

export class BehemothOpfs extends Behemoth {
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
		const progress = progression(blob.size, o?.onProgress)
		progress.start()

		const hash = await smartHash(blob, progress.hashing)

		if (!await this.has(hash))
			await writeBlobToOpfs(blob, this.#directory, hash, progress.storing)

		progress.done()
		return hash
	}

	async delete(hash: Hash) {
		await this.#directory.removeEntry(hash)
	}
}

