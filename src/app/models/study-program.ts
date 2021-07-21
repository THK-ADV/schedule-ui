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

export const isStudyProgramAtom = (a: any): a is StudyProgramAtom => {
  const sp = a as StudyProgramAtom
  return sp?.label !== undefined &&
    sp?.abbreviation !== undefined &&
    sp?.teachingUnit !== undefined &&
    sp?.graduation !== undefined &&
    sp?.id !== undefined
}
