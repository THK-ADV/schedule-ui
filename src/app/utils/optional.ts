export const zip = <A, B>(
  a: A | undefined,
  b: B | undefined
): [A, B] | undefined =>
  a !== undefined &&
  b !== undefined
    ? [a, b]
    : undefined

export const zip3 = <A, B, C>(
  a: A | undefined,
  b: B | undefined,
  c: C | undefined
): [A, B, C] | undefined =>
  a !== undefined &&
  b !== undefined &&
  c !== undefined
    ? [a, b, c]
    : undefined

export const zip5 = <A, B, C, D, E>(
  a: A | undefined,
  b: B | undefined,
  c: C | undefined,
  d: D | undefined,
  e: E | undefined,
): [A, B, C, D, E] | undefined =>
  a !== undefined &&
  b !== undefined &&
  c !== undefined &&
  d !== undefined &&
  e !== undefined
    ? [a, b, c, d, e]
    : undefined

export const mapOpt = <A, B>(
  a: A | undefined,
  f: (a: A) => B
): B | undefined => a && f(a)
