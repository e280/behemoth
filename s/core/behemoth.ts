
import {Hash} from "./types.js"

export abstract class Behemoth {
	abstract has(hash: Hash): Promise<boolean>
	abstract set(blob: Blob): Promise<Hash>
	abstract get(hash: Hash): Promise<Blob | undefined>
	abstract delete(hash: Hash): Promise<void>
	abstract require(hash: Hash): Promise<Blob>
}

