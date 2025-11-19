
import fs from "node:fs/promises"
import {chunks} from "../../core/tools/chunks.js"

/** stream a blob to disk without materializing it as a single buffer */
export async function writeBlobToFile(filepath: string, blob: Blob, onProgress: (n: number) => void) {
	let stored = 0
	onProgress(stored)

	const handle = await fs.open(filepath, "w")

	try {
		for await (const chunk of chunks(blob)) {
			await handle.write(chunk)
			stored += chunk.length
			onProgress(stored)
		}
	}
	finally {
		await handle.close()
	}
}

