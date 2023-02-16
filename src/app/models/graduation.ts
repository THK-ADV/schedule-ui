export interface Graduation {
  label: string,
  abbreviation: string,
  id: string
}

export const isGraduation = (a: unknown): a is Graduation => {
  const g = a as Graduation
  return g?.label !== undefined &&
    g?.abbreviation !== undefined &&
    g?.id !== undefined
}
