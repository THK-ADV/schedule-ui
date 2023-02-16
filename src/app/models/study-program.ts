import {Graduation, isGraduation} from './graduation'
import {isTeachingUnit, TeachingUnit} from './teaching-unit'

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

export const isStudyProgramAtom = (a: unknown): a is StudyProgramAtom => {
  const sp = a as StudyProgramAtom
  return sp?.label !== undefined &&
    sp?.abbreviation !== undefined &&
    isTeachingUnit(sp?.teachingUnit) &&
    isGraduation(sp?.graduation) &&
    sp?.id !== undefined
}
