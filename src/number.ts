import 'sugar'

declare global {
	interface NumberConstructor {
		/**
		 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a
		 * number). Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter
		 * to a number. Only values of the type number, that are also NaN, result in true.
		 * @param number A numeric value.
		 */
		isNaN(number: number): boolean
	}
}
