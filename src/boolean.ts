import * as Sugar from 'sugar'

declare global {
	interface BooleanConstructor {
		parse(value: any): boolean
	}
}

const falseStrings = ['false', 'no']

Sugar.createNamespace('Boolean')
	.defineStatic({

		parse(value: any) {
			let parse = value.valueOf()
			if (Object.isString(value)) {
				const [lc, num] = [value.toLowerCase(), +value]
				if (falseStrings.includes(lc))
					parse = false
				else if (!Number.isNaN(num))
					parse = num
			}
			return new Boolean(parse).valueOf()
		}

	})
