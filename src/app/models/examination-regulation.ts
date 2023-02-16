import {isStudyProgramAtom, StudyProgramAtom} from './study-program'

export interface ExaminationRegulation {
  studyProgram: string
  number: number
  start: Date
  end: Date | undefined
  id: string
}

export interface ExaminationRegulationAtom {
  studyProgram: StudyProgramAtom
  number: number
  start: Date
  end: Date | undefined
  id: string
}

export const isExaminationRegulationAtom = (a: unknown): a is ExaminationRegulationAtom => {
  const er = a as ExaminationRegulationAtom
  return isStudyProgramAtom(er?.studyProgram) &&
    er?.number !== undefined &&
    er?.start !== undefined &&
    er?.id !== undefined
}
