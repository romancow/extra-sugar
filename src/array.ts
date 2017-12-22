/// <reference path="../node_modules/sugar/sugar-extended.d.ts" />
import 'sugar'

type UnensuredArray<T> = T[] | T | null;

declare global {
	interface ArrayConstructor {
		ensure<T>(arr: UnensuredArray<T>, ignoreNull?: boolean): T[]
		move<T>(arr: T[], fromIndex: number, toIndex: number): T
		indexesOf<T>(arr: T[], items: T[] | T): number[]
	}
	
	interface Array<T> {
		// Sugar polyfills ES7's Array.includes, but doesn't provide a typescript definition of it
		includes<T>(elem: T, fromIndex?: number): boolean
		
		// Sugar's definitions doesn't include RegExp version
		exclude(search: RegExp): T[]
	
		move(fromIndex: number, toIndex: number): T
		indexesOf(items: T[] | T): number[]
	}
}

Sugar.Array.defineStatic({
	// Wraps the argument in an array if it isn't one
	ensure<T>(arr: UnensuredArray<T>, ignoreNull = false): T[] {
		const retEmpty = ignoreNull && (arr == null)
		return !retEmpty ? Array.isArray(arr) ? 
			arr : [arr as T] : ([] as T[])
	}
})

Sugar.Array.defineInstanceAndStatic({
	move<T>(array: T[], fromIndex: number, toIndex: number) {
		if (array == null) return;
		const item = array.splice(fromIndex, 1).first()
		array.splice(toIndex, 0, item)
		return item
	},

	indexesOf<T>(array: T[], items: T[] | T) {
		const itemsArr = Array.ensure<T>(items, items === undefined)
		return array
			.map<number | null>((item: T, index: number) => itemsArr.includes(item) ? index : null)
			.compact()
	}
})
