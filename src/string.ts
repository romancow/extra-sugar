import * as Sugar from 'sugar'

declare global {
	interface StringConstructor {
		canBeNumber(instance: string): boolean
		compare(str1: string | null, str2: string | null): -1 | 0 | 1
	}

	interface String {
		// #region polyfills

		/**
		 * Returns true if the sequence of elements of searchString converted to a String is the
		 * same as the corresponding elements of this object (converted to a String) starting at
		 * position. Otherwise returns false.
		 */
		startsWith(searchString: string, position?: number): boolean

		// #endregion polyfills

		canBeNumber(): boolean
		compare(str: string | null): -1 | 0 | 1
		splice(start: number, deleteCount?: number, ...items: string[]): string
	}
}

Sugar.String.defineInstanceAndStatic({
	canBeNumber(instance: string) {
		return !Number.isNaN(instance.toNumber())
	},

	compare(str1: string | null, str2: string | null) {
		let result = 0
		if (str1 != null && str2 != null)
			result = str1.localeCompare(str2)
		else if (str1 != null)
			result = -1
		else if (str2 != null)
			result = 1
		return result
	}
})

Sugar.String.defineInstanceWithArguments({
	splice(instance: string, start: number = 0, deleteCount: number = 0, items: string[] = []) {
		return instance.to(start) + items.join('') + instance.from(start + deleteCount)
	}
})
