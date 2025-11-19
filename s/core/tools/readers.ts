
export function readBlob(blob: Blob) {
	return readStream(blob.stream())
}

export async function* readStream(stream: ReadableStream<Uint8Array>) {
	const reader = stream.getReader()
	try {
		while (true) {
			const {done, value} = await reader.read()
			if (done) return
			yield value as Uint8Array
		}
	}
	finally {
		reader.releaseLock()
	}
}

