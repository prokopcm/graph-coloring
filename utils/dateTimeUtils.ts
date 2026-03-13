/** One minute in milliseconds */
export const ONE_MIN_MS = 60000

/** Two minutes in milliseconds */
export const TWO_MIN_MS = ONE_MIN_MS * 2

const currentDate = new Date()

/** Whether the current date is April 4th to 6th */
export const isSciFest = currentDate.getMonth() === 3 && currentDate.getDate() >= 4 && currentDate.getDate() <= 6
