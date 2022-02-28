import {Ordering} from './ordering'
import min = Ordering.min

describe('A min function', () => {
  it('should work with zero or one argument', () => {
    expect(min([], Ordering.numberOrd))
      .toBeUndefined()

    expect(min([5], Ordering.numberOrd))
      .toEqual(5)
  })
  it('should find the lowest int', () => {
    expect(min([5, 8, -2, 0, 3, -1, 10], Ordering.numberOrd))
      .toEqual(-2)
  })
  it('should find the lowest date', () => {
    const dates = [
      new Date('2022-02-05'),
      new Date('2022-05-09'),
      new Date('2022-03-16'),
      new Date('2022-01-14'),
      new Date('2022-01-18'),
    ]
    expect(min(dates, Ordering.dateOrd))
      .toEqual(new Date('2022-01-14'))
  })
})




