
import {SetProgress} from "../types.js"

export const progression = (size: number, onProgress: (p: SetProgress) => void = () => {}) => ({
	start: () => onProgress({
		phase: "hashing",
		size,
		hashed: 0,
		stored: 0,
	}),

	hashing: (hashed: number) => onProgress({
		phase: "hashing",
		size,
		hashed,
		stored: 0,
	}),

	storing: (stored: number) => onProgress({
		phase: "storing",
		size,
		hashed: size,
		stored,
	}),

	done: () => onProgress({
		phase: "done",
		size,
		hashed: size,
		stored: size,
	}),
})

