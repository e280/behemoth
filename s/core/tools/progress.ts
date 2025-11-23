
import {Progress} from "../types.js"
import {rateLimit} from "./rate-limit.js"

export function progress(total: number, onProgress: ((p: Progress) => void) = (() => {})) {
	return rateLimit(100, (done: number) => onProgress({total, done}))
}

