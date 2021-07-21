export const zip = <A, B>(
  a: A | undefined,
  b: B | undefined
): [A, B] | undefined => a && b ? [a, b] : undefined

export const zip3 = <A, B, C>(
  a: A | undefined,
  b: B | undefined,
  c: C | undefined
): [A, B, C] | undefined => a && b && c ? [a, b, c] : undefined

export const mapOpt = <A, B>(
  a: A | undefined,
  f: (a: A) => B
): B | undefined => a && f(a)
