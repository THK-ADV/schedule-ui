import {Graduation} from './graduation'
import {TeachingUnit} from './teaching-unit'

export interface StudyProgram {
  label: string
  abbreviation: string
  teachingUnit: string
  graduation: string
  id: string
}

export interface StudyProgramAtom {
  label: string
  abbreviation: string
  teachingUnit: TeachingUnit
  graduation: Graduation
  id: string
}
