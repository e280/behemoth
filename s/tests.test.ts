
import {Science, suite, test, expect} from "@e280/science"

await Science.run({
	"behemoth": suite({
		"lol": test(async() => {
			expect(1).ok()
		}),
	}),
})

