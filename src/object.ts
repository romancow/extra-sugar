import * as Sugar from 'sugar'

declare global {
	interface ObjectConstructor {
		// #region polyfills
		/**
		 * Copy the values of all of the enumerable own properties from one or more source objects to a
		 * target object. Returns the target object.
		 * @param target The target object to copy to.
		 * @param source The source object from which to copy properties.
		 */
		assign<T, U>(target: T, source: U): T & U

		/**
		 * Copy the values of all of the enumerable own properties from one or more source objects to a
		 * target object. Returns the target object.
		 * @param target The target object to copy to.
		 * @param source1 The first source object from which to copy properties.
		 * @param source2 The second source object from which to copy properties.
		 */
		assign<T, U, V>(target: T, source1: U, source2: V): T & U & V

		/**
		 * Copy the values of all of the enumerable own properties from one or more source objects to a
		 * target object. Returns the target object.
		 * @param target The target object to copy to.
		 * @param source1 The first source object from which to copy properties.
		 * @param source2 The second source object from which to copy properties.
		 * @param source3 The third source object from which to copy properties.
		 */
		assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W

		/**
		 * Copy the values of all of the enumerable own properties from one or more source objects to a
		 * target object. Returns the target object.
		 * @param target The target object to copy to.
		 * @param sources One or more source objects from which to copy properties
		 */
		assign(target: object, ...sources: any[]): any
		// #endregion

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
		when<T>(instance: T, condition: boolean | ((obj: T) => boolean), whenFn: Object.WhenFn<T>): T

		isDefined(instance: any): boolean
	}

	namespace Object {
		type CollectFn<T extends Object, U> = sugarjs.Object.CollectFn<T, U>
		type MapFn<T extends Object, U> = sugarjs.Object.MapFn<T, U>
		type KeyMap<T extends Object> = sugarjs.Object.KeyMap<T>
		type DuplicateFn = sugarjs.Object.DuplicateFn
		type WhenFn<T> = sugarjs.Object.WhenFn<T>
	}

	namespace sugarjs {
		namespace Object {
			type CollectFn<T extends Object, U> = (val: T[keyof T], key: keyof T, obj: T) => U
			type MapFn<T extends Object, U> = CollectFn<T, U>
			type KeyMap<T extends Object> = ((key: keyof T, value: T[keyof T], obj: T) => primitive) | { [key: string]: primitive }
			type DuplicateFn = <T extends Object>(orig: T) => T | typeof Sugar
			type WhenFn<T> = (obj: T) => (T | void)

			interface Constructor {
				<T extends Object>(raw?: T): Chainable<T>
				new<T extends Object>(raw?: T): Chainable<T>
			}

			interface ChainableBase<RawValue> {
				mapKeys(map: KeyMap<RawValue>, skipNull?: boolean) : SugarDefaultChainable<Object>
				cordon(deep?: boolean): SugarDefaultChainable<Readonly<RawValue>>
				collect<U>(collectFn: CollectFn<RawValue, U>): SugarDefaultChainable<U[]>
				replace<K extends keyof RawValue>(key: K, replacer: (val: RawValue[K], obj: RawValue) => RawValue[K]): SugarDefaultChainable<RawValue>
				selectValues<K extends keyof RawValue>(keys: UnensuredArray<K>): SugarDefaultChainable<RawValue[K][]>
				getWithDefault<U>(key: string, dfault: U, inherited?: boolean): SugarDefaultChainable<U>
				duplicate(duplicateFn?: DuplicateFn): SugarDefaultChainable<RawValue>
				when(condition: boolean | ((obj: RawValue) => boolean), whenFn: WhenFn<RawValue>): SugarDefaultChainable<RawValue>
			}
		}
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
		return Array.ensure(keys, true).map((key: K) => instance[key])
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
				result = <any>instance.map((item: any) => Object.duplicate(item, duplicateFn))
			else if (Object.isObject(instance))
				result = <any>Object.map(instance, val => <any>Object.duplicate(<any>val, duplicateFn))
			else
				result = Object.clone(instance)
		}
		return result
	},

	when<T>(instance: T, condition: boolean | ((obj: T) => boolean), whenFn: Object.WhenFn<T>) {
		const doWhenFn = Object.isFunction(condition) ? condition(instance) : condition
		if (!doWhenFn) return instance
		const updated = whenFn(instance)
		return Object.isDefined(updated) ? updated : instance
	}
})

Sugar.Object.defineStatic({
	isDefined(instance: any) {
		return (typeof instance !== 'undefined')
	}
})

Sugar.Object.defineStaticPolyfill({
	assign(target: Object, sources: Object[]) {
		return Object.mergeAll(target, sources)
	}
})
