export interface Graduation {
  label: string,
  abbreviation: string,
  id: string
}

export const isGraduation = (a: any): a is Graduation =>
  (a as Graduation)?.label !== undefined &&
  (a as Graduation)?.abbreviation !== undefined &&
  (a as Graduation)?.id !== undefined
