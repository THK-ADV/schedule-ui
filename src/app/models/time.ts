export interface Time {
  date: Date
  hour: number
  minute: number
  seconds: number
}

// parses numbers out of 'HH:mm:ss'. fallback are 0 for time values
export const timeFromString = (timeString: string, date?: Date): Time => {
  date = date || new Date(+0)
  const time = splitToNumbers(timeString)
  const h = time.shift() || 0
  const m = time.shift() || 0
  const s = time.shift() || 0

  date = new Date(date.setHours(h, m, s))
  return fromDate(date)
}

const splitToNumbers = (timeString: string): number[] =>
  timeString
    .split(':')
    .map(Number)
    .filter(isNumber)

const isNumber = (value: unknown): value is number =>
  typeof value === 'number'

const fromDate = (date: Date): Time => ({
  date,
  hour: date.getHours(),
  minute: date.getMinutes(),
  seconds: date.getSeconds()
})
