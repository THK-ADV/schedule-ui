import {Faculty} from './faculty'

export interface TeachingUnit {
  label: string
  abbreviation: string
  faculty: string
  number: number
  id: string
}

export interface TeachingUnitAtom {
  label: string
  abbreviation: string
  faculty: Faculty
  number: number
  id: string
}

export const isTeachingUnit = (a: any): a is TeachingUnit => {
  const tu = a as TeachingUnit
  return tu?.label !== undefined &&
    tu?.abbreviation !== undefined &&
    tu?.faculty !== undefined &&
    tu?.number !== undefined &&
    tu?.id !== undefined
}
