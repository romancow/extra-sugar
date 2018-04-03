import * as Sugar from 'sugar'

declare global {
	interface FunctionConstructor {
		isA(instance: Function, classType: Function): boolean
	}

	interface Function {
		isA(classType: Function): boolean
	}
}

Sugar.Function.defineInstanceAndStatic({
	isA(instance: Function, classType: Function) {
		return (classType != null) &&
			((instance == classType) || (instance.prototype instanceof classType))
	}
})
