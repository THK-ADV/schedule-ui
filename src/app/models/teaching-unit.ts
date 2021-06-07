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
