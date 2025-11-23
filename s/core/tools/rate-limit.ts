
export function rateLimit<Fn extends (...args: any[]) => void>(
		interval: number,
		fn: Fn,
	) {

	let last = 0

	return function(this: any, ...args: any[]) {
		const now = Date.now()
		const since = now - last

		if (since >= interval) {
			last = now
			fn.apply(this, args)
		}
	}
}

