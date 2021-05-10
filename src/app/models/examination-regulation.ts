import { StudyProgram } from "./study-program";

export interface ExaminationRegulation {
    label: string, 
    abbreviation: string, 
    accreditationDate: string,
    activationDate: string,
    expiringDate?: string,
    studyProgram: string,
    id: string
}

export interface ExaminationRegulationAtom {
    label: string, 
    abbreviation: string, 
    accreditationDate: Date,
    activationDate: Date,
    expiringDate?: Date,
    studyProgram: StudyProgram,
    id: string
}