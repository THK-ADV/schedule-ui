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

export const isStudyProgramAtom = (a: any): a is StudyProgramAtom =>
  (a as StudyProgramAtom)?.label !== undefined &&
  (a as StudyProgramAtom)?.abbreviation !== undefined &&
  (a as StudyProgramAtom)?.teachingUnit !== undefined &&
  (a as StudyProgramAtom)?.graduation !== undefined &&
  (a as StudyProgramAtom)?.id !== undefined
