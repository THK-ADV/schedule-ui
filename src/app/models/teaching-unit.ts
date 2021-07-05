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

export const isTeachingUnit = (a: any): a is TeachingUnit =>
  (a as TeachingUnit)?.label !== undefined &&
  (a as TeachingUnit)?.abbreviation !== undefined &&
  (a as TeachingUnit)?.faculty !== undefined &&
  (a as TeachingUnit)?.number !== undefined &&
  (a as TeachingUnit)?.id !== undefined

