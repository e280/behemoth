
import {Flow} from "../types.js"
import {readStream} from "./readers.js"

export function readFlow(flow: Flow): AsyncIterable<Uint8Array> {
	if (flow instanceof Blob)
		return readStream(flow.stream())

	if (flow instanceof ReadableStream)
		return readStream(flow)

	if ((flow as any)[Symbol.asyncIterator])
		return flow as any

	if ((flow as any)[Symbol.iterator])
		return (async function*(){ for (const c of flow as any) yield c })()

	throw new Error("invalid streamable")
}

