/// <reference types="sugar/sugar-extended" />
import * as Sugar from 'sugar'

export type UnensuredArray<T> = T[] | T | null;

declare global {
	interface ArrayConstructor {
		// Sugar polyfills Array.from, but doesn't provide a typescript definition of it
		from<T>(arrLike: ArrayLike<T>): T[]
		from<T, U>(arrLike: ArrayLike<T>, mapFn: Array.MapFn<T, U>, context?: any): U[]

		ensure<T>(instance: UnensuredArray<T>, ignoreNull?: boolean): T[]
		move<T>(instance: T[], fromIndex: number, toIndex: number): T
		indexesOf<T>(instance: T[], items: T[] | T): number[]
		sift<T>(instance: T[], search: Array.SearchFn<T>): T[]
		tapEach<T>(instance: T[], eachFn: Array.CallbackFn<T>, context?: any): T[]
		toObject<T>(instance: T[], mapFn: Array.MapToKeyFn<T>): { [key: string]: any }
		indexes(instance: any[]): sugarjs.Range
		normalizeIndex(instance: any[], index: number, loop?: boolean): number
		expel<T>(instance: T[], items: UnensuredArray<T>): T[]
		transpose<T>(instance: T[][], missing?: T | Array.TransposeMissignFn<T>): T[][]
	}

	interface Array<T> {
		// Sugar polyfills ES7's Array.includes, but doesn't provide a typescript definition of it
		includes(elem: T, fromIndex?: number): boolean
		// Sugar's definitions doesn't include RegExp version
		exclude(search: RegExp): T[]
		remove(search: T|Array.SearchFn<T>): T[]
		// Sugar's `Array.map` definition screws up intellisense, which is a pain since it's used a lot
		map<U>(map: string | Array.MapFn<T, U>, context?: any): U[]
		exclude(search: T|Array.SearchFn<T>): T[]

		move(fromIndex: number, toIndex: number): T
		indexesOf(items: T[] | T): number[]
		sift(search: Array.SearchFn<T>): T[]
		tapEach(eachFn: Array.CallbackFn<T>, context?: any): this
		toObject(mapFn: Array.MapToKeyFn<T>): { [key: string]: any }
		indexes(): sugarjs.Range
		normalizeIndex(index: number, loop?: boolean): number
		expel(items: UnensuredArray<T>): this
		transpose<T extends Array<U>, U>(missing?: U | Array.TransposeMissignFn<U>): U[][]
	}

	namespace Array {
		type MapFn<T, U> = (value: T, index: number, array: ReadonlyArray<T>) => U
		type CallbackFn<T> = (value: T, index: number, array: T[]) => void
		type SearchFn<T> = (el: T, i: number, arr: T[]) => boolean
		type MapToKeyFn<T> = (el: T, index: number, array: T[]) => string | [string, any]
		type TransposeMissignFn<T> = (rowIndex: number, colIndex: number, array: T[][]) => T
	}
}

const TransposeThrowErrorFn = (rowIndex: number, colIndex: number) => {
	throw new Error(`Can't transpose, missing column ${colIndex} of row ${rowIndex}`)
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
	},

	// Removes elements from array where fn is true and returns the removed elements
	sift<T>(array: T[], search: Array.SearchFn<T>) {
		const removed: T[] = []
		array.remove((el, i, arr) => {
			const remove = search(el, i, arr)
			if (remove) removed.push(el)
			return remove
		})
		return removed
	},

	// Like Array's forEach, but returns the array instead of undefined
	tapEach<T>(array: T[], eachFn: Array.CallbackFn<T>, context?: any) {
		array.forEach(eachFn, context)
		return array
	},

	// Maps each element of an array to a key/value pair in a new object
	toObject<T>(array: T[], mapFn?: Array.MapToKeyFn<T>) {
		const keyMapFn = (mapFn != null) ? mapFn : (el: T) => el && `${el}`
		return array.reduce((obj, current, index, arr) => {
			const result = keyMapFn(current, index, arr)
			const [key, val] = Object.isArray(result) ? result : [result, current]
			if (key != null) obj[key] = val
			return obj
		}, <{[key: string]: any}>{})
	},

	indexes(array: any[]) {
		return Number.range(0, array.length)
	},

	normalizeIndex(array: any[], index: number, loop: boolean = false) {
		let normalized = index
		if (index && loop) normalized %= array.length
		if (normalized < 0) normalized += array.length
		return normalized
	},

	// Like `subtract`, but modifies the original array
	expel<T>(array: T[], items: UnensuredArray<T>) {
		const itemsArr = Array.ensure(items, items === undefined)
		return array.remove((item) => itemsArr.includes(item))
	},

	// Transposes the rows and columns in array of arrays
	transpose<T>(array: T[][], missing: T | Array.TransposeMissignFn<T> = TransposeThrowErrorFn) {
		const size = array.map<number>('length').max()
		return size.times(colIndex => {
			return array.map((subArr, rowIndex) => {
				if (colIndex < subArr.length)
					return subArr[colIndex]
				else if (Object.isFunction(missing!))
					return (missing as Function)(colIndex, rowIndex, array)
				else return missing
			})
		})
	}
})
