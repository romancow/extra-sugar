import * as Sugar from 'sugar'

declare global {

	interface DateConstructor {
		earliest(dates: readonly Date[]): Date
		latest(dates: readonly Date[]): Date
	}

}

Sugar.Date.defineStatic({

	earliest(dates: readonly Date[]) {
		return dates.reduce((prev, date) => date.isBefore(prev) ? date : prev)
	},

	latest(dates: readonly Date[]) {
		return dates.reduce((prev, date) => date.isAfter(prev) ? date : prev)
	}

})
