
import {bytes} from "@e280/stz"
import fs from "node:fs/promises"
import {Science, suite, test, expect} from "@e280/science"
import {BehemothDisk} from "./node/behemoth-disk.js"
import {BehemothMemory} from "./core/behemoth-memory.js"

await Science.run({
	"BehemothMemory": suite({
		"set+get": test(async() => {
			const behemoth = new BehemothMemory()
			const alpha = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])
			const hash = await behemoth.set(new Blob([alpha]))
			const bravo1 = await behemoth.require(hash)
			const bravo2 = new Uint8Array(await bravo1.arrayBuffer())
			expect(bytes.eq(alpha, bravo2)).is(true)
		}),
	}),

	"BehemothDisk (node)": suite({
		"set+get": test(async() => {
			const behemoth = await BehemothDisk.directory("./yard")
			const alpha = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])
			const hash = await behemoth.set(new Blob([alpha]))
			const bravo1 = await behemoth.require(hash)
			const bravo2 = new Uint8Array(await bravo1.arrayBuffer())
			expect(bytes.eq(alpha, bravo2)).is(true)
			await fs.rm(`./yard/${hash}`)
		}),
	}),
})

