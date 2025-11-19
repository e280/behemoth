
import fs from "node:fs/promises"

export async function writeToFile(
		path: string,
		chunks: AsyncIterable<Uint8Array>,
		onProgress: (n: number) => void,
	) {

	let stored = 0
	onProgress(stored)

	const handle = await fs.open(path, "w")

	try {
		for await (const chunk of chunks) {
			await handle.write(chunk)
			stored += chunk.length
			onProgress(stored)
		}
	}
	finally {
		await handle.close()
	}
}

