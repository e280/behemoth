
import {BehemothDisk} from "./adapters/node/behemoth-disk.js"

const behemoth = await BehemothDisk.make("./x/example")
const bytes = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])
const hash = await behemoth.set(new Blob([bytes]))
console.log("saved", hash)

const data = await behemoth.get(hash)
console.log("loaded", data?.size)

