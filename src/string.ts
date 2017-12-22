import 'sugar'

declare global {
	interface StringConstructor {
		compare(str1: string | null, str2: string | null): -1 | 0 | 1
	}
	
	interface String {
		compare(str: string | null): -1 | 0 | 1
	}
}

Sugar.String.defineInstanceAndStatic({
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
