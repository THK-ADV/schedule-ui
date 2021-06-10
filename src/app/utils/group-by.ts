export type Group<K, V> = Map<K, V[]>

export const groupBy = <K, V>(xs: Readonly<V[]>, key: (v: V) => K): Group<K, V> => {
  const dict: Group<K, V> = new Map<K, V[]>()

  xs.forEach((x) => {
    const k = key(x)
    const collection = dict.get(k)
    if (!collection) {
      dict.set(k, [x])
    } else {
      collection.push(x)
    }
  })

  return dict
}

export const mapGroup = <K, V, T>(map: Group<K, V>, f: (k: K, v: V[]) => T): T[] => {
  const xs: T[] = []
  forEachGroup(map, (k, v) => xs.push(f(k, v)))
  return xs
}

export const forEachGroup = <K, V>(map: Group<K, V>, f: (k: K, v: V[], i: number) => void) => {
  let i = 0
  map.forEach((v, k) => f(k, v, i++))
}
