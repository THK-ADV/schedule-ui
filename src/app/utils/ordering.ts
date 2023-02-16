export type Ordering<A> = (lhs: A, rhs: A) => OrderingResult

export type OrderingResult = -1 | 0 | 1

export namespace Ordering {
  export const contraMap = <A, B>(ord: Ordering<A>, f: (b: B) => A): Ordering<B> =>
    (b0, b1) => ord(f(b0), f(b1))

  export const numberOrd: Ordering<number> = (lhs, rhs) =>
    lhs < rhs ? -1 : (lhs > rhs ? 1 : 0)

  export const dateOrd: Ordering<Date> = contraMap(numberOrd, d => d.getTime())

  export const min = <A>(as: Readonly<A[]>, ord: Ordering<A>): A | undefined => {
    function go(): A {
      let res = as[0]
      as.forEach(a => {
        if (ord(a, res) < 0) {
          res = a
        }
      })
      return res
    }

    switch (as.length) {
      case 0:
        return undefined
      case 1:
        return as[0]
      default:
        return go()
    }
  }
}

