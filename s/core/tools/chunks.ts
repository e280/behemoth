
export async function* chunks(blob: Blob) {
	const reader = blob.stream().getReader()

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

