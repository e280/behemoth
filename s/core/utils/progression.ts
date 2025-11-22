
import {Progress} from "../types.js"

export class Progression {
	static blobStorage(blobSize: number, onProgress: ((p: Progress) => void) = (() => {})) {
		let total = blobSize * 2
		let done = 0
		onProgress({total, done})

		function report() {
			done = hashing.done + storing.done
			onProgress({total, done})
		}

		function finish() {
			onProgress({total, done: total})
		}

		const hashing = new Progression(blobSize, report)
		const storing = new Progression(blobSize, report)
		return {hashing, storing, finish}
	}

	done = 0

	constructor(
		public total: number,
		public onProgress: ((p: Progress) => void) = (() => {}),
	) {}

	#report() {
		const {total, done} = this
		this.onProgress({total, done})
	}

	add = (n: number) => {
		this.done += n
		this.#report()
	}

	set = (n: number) => {
		this.done = n
		this.#report()
	}

	finish = () => {
		this.done = this.total
		this.#report()
	}
}

