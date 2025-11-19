
import {Hash} from "../core/types.js"
import {Behemoth} from "../core/behemoth.js"
import {smartHash} from "../tools/smart-hash.js"
import {get_opfs_file_handle} from "../tools/get_opfs_file_handle.js"

export class BehemothOpfs extends Behemoth {
	#directory: FileSystemDirectoryHandle

	constructor(directory: FileSystemDirectoryHandle) {
		super()
		this.#directory = directory
	}

	async has(hash: Hash) {
		return !!await get_opfs_file_handle(this.#directory, hash)
	}

	async set(blob: Blob) {
		const hash = await smartHash(blob)
		const exists = await this.has(hash)
		if (!exists) {
			const handle = await this.#directory.getFileHandle(hash, {create: true})
			const writable = await handle.createWritable()
			await writable.write(blob)
			await writable.close()
		}
		return hash
	}

	async delete(hash: Hash) {
		await this.#directory.removeEntry(hash)
	}

	async require(hash: Hash) {
		const handle = await this.#directory.getFileHandle(hash)
		return handle.getFile()
	}

	async get(hash: Hash) {
		const handle = await get_opfs_file_handle(this.#directory, hash)
		return handle?.getFile()
	}
}

