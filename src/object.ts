import 'sugar'

type primitive = boolean | number | string | symbol | null | undefined

type CollectFn<T extends Object, U> = (val: T[keyof T], key: keyof T, obj: T) => U;
type ObjectKeyMap<T extends Object> = ((key: keyof T, value: T[keyof T], T) => primitive) | { [key: string]: primitive }

declare global {
	interface ObjectConstructor {
		// better/updated definitions for Sugar's added object methods
		clone<T extends Object>(instance: T, deep?: boolean): T
		forEach<T extends Object>(instance: T, fn: (val: T[keyof T], key: keyof T, obj: T) => void): T
		select<T extends Object>(instance: T, find: string|RegExp|Array<string>|Object): Partial<T>

		mapKeys<T extends Object>(instance: T, map: ObjectKeyMap<T>, skipNull?: boolean) : Object
		cordon<T extends Object>(instance: T, deep?: boolean): Readonly<T>
		collect<T extends Object, U>(instance: T, collectFn: CollectFn<T, U>): U[]
		replace<T extends Object, K extends keyof T>(instance: T, key: K, replacer: (val: T[K], obj: T) => T[K]): T
		isDefined(instance: any): boolean
	}
}

Sugar.Object.defineInstanceAndStatic({
	mapKeys<T extends {}>(instance: T, map: ObjectKeyMap<T>, skipNull?: boolean) {
		if (!Object.isFunction(map)) {
			// optimization - don't iterate through entire object when we know the keys we want
			const partial = skipNull ? Object.select(instance, map) : instance
			return Object.mapKeys(partial, (key) => map[key], skipNull)
		}
		else {
			const mapped = {}
			Object.forEach(instance, (val, key) => {
				let newKey = map(key, val, instance)
				if ((newKey !== false) && ((newKey != null) || !skipNull)) {
					if ((newKey === true) || (newKey == null)) newKey = key
					mapped[newKey] = val
				}
			})
			return mapped
		}
	},

	cordon<T extends Object>(instance: T, deep = false) {
		return Object.freeze(Object.clone(instance, deep))
	},

	collect<T extends Object, U>(instance: T, collectFn: CollectFn<T, U>) {
		return Object.keys<keyof T>(instance)
			.map((key: keyof T) => collectFn(instance[key], key, instance))
	},

	replace<T extends Object, K extends keyof T>(instance: T, key: K, replacer: (val: T[K], obj: T) => T[K]) {
		const val = Object.get<T[K]>(instance, key)
		const replacement = replacer.call(instance, val, instance)
		if (replacement !== val)
			Object.set(instance, key, replacement)
		return instance
	}
})

Sugar.Object.defineStatic({
	isDefined(instance) { 
		return (typeof instance !== 'undefined') 
	}
})