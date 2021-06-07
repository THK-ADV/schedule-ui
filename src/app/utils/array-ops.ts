export const distinctBy = <A, B>(as: A[], f: (a: A) => B): A[] => {
  const unique: A[] = []
  for (const nxt of as) {
    if (!unique.some(a => f(a) === f(nxt))) {
      unique.push(nxt)
    }
  }
  return unique
}
