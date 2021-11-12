export const distinctBy = <A, B>(as: A[], f: (a: A) => B): A[] => {
  const unique: A[] = []
  for (const nxt of as) {
    if (!unique.some(a => f(a) === f(nxt))) {
      unique.push(nxt)
    }
  }
  return unique
}

export const distinctMap = <A, B>(as: A[], f: (a: A) => B): B[] => {
  const unique: B[] = []
  for (const nxt of as) {
    const nxtB = f(nxt)
    if (!unique.some(b => b === nxtB)) {
      unique.push(nxtB)
    }
  }
  return unique
}
