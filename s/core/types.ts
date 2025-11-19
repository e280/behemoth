
export type Hash = string

export type SetProgress = {

	/** the current progress phase of the operation */
	phase: "hashing" | "storing" | "done"

	/** how many bytes in the payload */
	size: number

	/** how many bytes have been hashed */
	hashed: number

	/** how many bytes have been written */
	stored: number
}

export type SetOptions = {
	onProgress?: (progress: SetProgress) => void
}

