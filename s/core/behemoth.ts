
import {SetOptions, Hash} from "./types.js"

export abstract class Behemoth {
	abstract has(hash: Hash): Promise<boolean>
	abstract require(hash: Hash): Promise<Blob>
	abstract get(hash: Hash): Promise<Blob | undefined>
	abstract set(blob: Blob, o?: SetOptions): Promise<Hash>
	abstract delete(hash: Hash): Promise<void>
}

