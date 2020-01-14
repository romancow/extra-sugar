import 'sugar'

declare global {

	namespace sugarjs {
		interface Range {
			readonly start: number | Date
			readonly end: number | Date
		}
	}

}
