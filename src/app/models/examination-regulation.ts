import {StudyProgramAtom} from './study-program'

export interface ExaminationRegulation {
  studyProgram: string
  number: number
  start: Date
  end?: Date
  id: string
}

export interface ExaminationRegulationAtom {
  studyProgram: StudyProgramAtom
  number: number
  start: Date
  end?: Date
  id: string
}
