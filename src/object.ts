import * as Sugar from 'sugar'
import { UnensuredArray } from './array'

declare global {
	interface ObjectConstructor {
		// better/updated definitions for Sugar's added object methods
		clone<T extends Object>(instance: T, deep?: boolean): T
		forEach<T extends Object>(instance: T, fn: (val: T[keyof T], key: keyof T, obj: T) => void): T
		select<T extends Object>(instance: T, find: string | RegExp | Array<string> | Object): Partial<T>
		map<T extends Object, U>(instance: T, map: keyof T | Object.MapFn<T, U>): Record<keyof T, U>
		isObject<T extends {} = {}>(instance: any): instance is T

		mapKeys<T extends Object>(instance: T, map: Object.KeyMap<T>, skipNull?: boolean) : Object
		cordon<T extends Object>(instance: T, deep?: boolean): Readonly<T>
		collect<T extends Object, U>(instance: T, collectFn: Object.CollectFn<T, U>): U[]
		replace<T extends Object, K extends keyof T>(instance: T, key: K, replacer: (val: T[K], obj: T) => T[K]): T
		selectValues<T extends Object, K extends keyof T>(instance: T, keys: UnensuredArray<K>): T[K][]
		getWithDefault<T extends Object, U>(instance: T, key: string, dfault: U, inherited?: boolean): U
		duplicate<T extends Object>(instance: T, duplicateFn?: Object.DuplicateFn): T
		when<T>(instance: T, condition: boolean | ((obj: T) => boolean), whenFn: (obj: T) => T): T

		isDefined(instance: any): boolean
	}

	namespace Object {
		type CollectFn<T extends Object, U> = (val: T[keyof T], key: keyof T, obj: T) => U
		type MapFn<T extends Object, U> = CollectFn<T, U>
		type KeyMap<T extends Object> = ((key: keyof T, value: T[keyof T], obj: T) => primitive) | { [key: string]: primitive }
		type DuplicateFn = <T extends Object>(orig: T) => T | typeof Sugar
	}
}

Sugar.Object.defineInstanceAndStatic({
	mapKeys<T extends {}>(instance: T, map: Object.KeyMap<T>, skipNull?: boolean) {
		if (!Object.isFunction(map)) {
			// optimization - don't iterate through entire object when we know the keys we want
			const partial = skipNull ? Object.select(instance, map) : instance
			return Object.mapKeys(partial, (key) => map[<string>key], skipNull)
		}
		else {
			const mapped: { [key: string]: any } = {}
			Object.forEach(instance, (val, key) => {
				let newKey = map(key, val, instance)
				if ((newKey !== false) && ((newKey != null) || !skipNull)) {
					if ((newKey === true) || (newKey == null)) newKey = key
					mapped[<string>newKey] = val
				}
			})
			return mapped
		}
	},

	cordon<T extends Object>(instance: T, deep = false) {
		return Object.freeze(Object.clone(instance, deep))
	},

	collect<T extends Object, U>(instance: T, collectFn: Object.CollectFn<T, U>) {
		return Object.keys<keyof T>(instance)
			.map((key: keyof T) => collectFn(instance[key], key, instance))
	},

	replace<T extends Object, K extends keyof T>(instance: T, key: K, replacer: (val: T[K], obj: T) => T[K]) {
		const val = Object.get<T[K]>(instance, <string>key)
		const replacement = replacer.call(instance, val, instance)
		if (replacement !== val)
			Object.set(instance, <string>key, replacement)
		return instance
	},

	selectValues<T extends Object, K extends keyof T>(instance: T, keys: UnensuredArray<K>) {
		return Array.ensure<K>(keys, true).map((key: K) => instance[key])
	},

	getWithDefault<T extends Object, U>(instance: T, key: string, dfault: U, inherited?: boolean) {
		const hasKey = Object.has(instance, key, inherited)
		return hasKey ? Object.get<U>(instance, key, inherited) : dfault
	},

	duplicate<T extends Object>(instance: T, duplicateFn?: Object.DuplicateFn) {
		const cloneable = <{clone: () => T}><any>instance
		let result = duplicateFn && duplicateFn(instance)
		if (!duplicateFn || (result === Sugar)) {
			if (cloneable && Object.isFunction(cloneable.clone))
				result = cloneable.clone()
			else if (Object.isArray(instance))
				result = <any>instance.map(item => Object.duplicate(item, duplicateFn))
			else if (Object.isObject(instance))
				result = <any>Object.map(instance, val => <any>Object.duplicate(<any>val, duplicateFn))
			else
				result = Object.clone(instance)
		}
		return result
	}
})

Sugar.Object.defineStatic({
	isDefined(instance: any) {
		return (typeof instance !== 'undefined')
	}
})
