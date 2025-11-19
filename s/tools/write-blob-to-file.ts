
import fs from "node:fs/promises"
import {chunks} from "./chunks.js"

/** stream a blob to disk without materializing it as a single buffer */
export async function writeBlobToFile(filepath: string, blob: Blob) {
	const handle = await fs.open(filepath, "w")
	try {
		for await (const chunk of chunks(blob))
			await handle.write(chunk)
	}
	finally {
		await handle.close()
	}
}

