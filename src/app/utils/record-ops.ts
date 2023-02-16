export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === 'object' && value !== null && value !== undefined) {
    return value as Record<string, unknown>
  } else {
    return undefined
  }
}

export const nestedObjectPropertyAccessor = (obj: unknown, prop: string): string => {
  const props = prop.split('.')
  let record = asRecord(obj)
  let res = ''
  props.forEach(prop => {
    if (record && prop in record) {
      res = String(record[prop])
      record = asRecord(record[prop])
    }
  })
  return res
}
