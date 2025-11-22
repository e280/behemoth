
export type Hash = string

export type Flow = (
	| Blob
	| Iterable<Uint8Array>
	| AsyncIterable<Uint8Array>
	| ReadableStream<Uint8Array>
)

export type Progress = {

	/** total amount of work */
	total: number

	/** amount of work that is completed */
	done: number
}

export type SetOptions = {
	onProgress?: (progress: Progress) => void
}

