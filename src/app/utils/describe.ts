import {Lecturer, User} from '../models/user'
import {Language} from '../models/language'
import {Season} from '../models/season'
import {Module, ModuleAtom} from '../models/module'
import {ExaminationRegulationAtom} from '../models/examination-regulation'
import {StudyProgramAtom} from '../models/study-program'

export type Describe<A> = (a: A) => string

export const describeLecturer: Describe<Lecturer> = l =>
  `${describeUser(l)} (${l.initials})`

export const describeUser: Describe<User> = u =>
  `${u.lastname}, ${u.firstname}`

export const describeUserWithCampusId: Describe<User> = u =>
  `${describeUser(u)} (${u.username})`

export const describeUserInitials: Describe<User> = u =>
  `${u.firstname.charAt(0).toUpperCase()}.${u.lastname.charAt(0).toUpperCase()}`

export const describeModule: Describe<Module> = m =>
  `${m.label} (${m.abbreviation})`

export const describeModuleAtom: Describe<ModuleAtom> = m =>
  `${m.label} (${m.abbreviation}) (${describeUserWithCampusId(m.courseManager)})`

export const describeExamReg: Describe<ExaminationRegulationAtom> = er =>
  `${er.studyProgram.label} (${er.studyProgram.graduation.abbreviation} ${er.number})`

export const describeExamRegShort: Describe<ExaminationRegulationAtom> = er =>
  `${er.studyProgram.abbreviation} (${er.number})`

export const describeStudyProgramAtom: Describe<StudyProgramAtom> = sp =>
  `${sp.label} (${sp.abbreviation} ${sp.graduation.abbreviation})`

export const describeBoolean: Describe<boolean> = b =>
  b ? 'Ja' : 'Nein'

export const describeLanguage: Describe<Language> = l => {
  switch (l) {
    case 'de':
      return 'Deutsch'
    case 'en':
      return 'Englisch'
    case 'de_en':
      return 'Deutsch und Englisch'
    default:
      return 'Unbekannt'
  }
}

export const describeSeason: Describe<Season> = s => {
  switch (s) {
    case 'SoSe':
    case 'WiSe':
      return s
    case 'SoSe_WiSe':
      return 'SoSe & WiSe'
    case 'unknown':
      return 'unbekannt'
  }
}
