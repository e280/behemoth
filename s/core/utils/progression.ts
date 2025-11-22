
import {Progress} from "../types.js"

export const progression = (
		total: number,
		onProgress: ((p: Progress) => void) = (() => {}),
	) => {

	let done = 0
	onProgress({total, done})

	return {
		add: (n: number) => {
			done += n
			onProgress({total, done})
		},

		done: () => {
			onProgress({total, done: total})
		},
	}
}

