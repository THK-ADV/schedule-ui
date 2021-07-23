import {isStudyProgramAtom, StudyProgramAtom} from '../models/study-program'
import {isTeachingUnit, TeachingUnit} from '../models/teaching-unit'
import {Graduation, isGraduation} from '../models/graduation'
import {isLecturer, Lecturer} from '../models/user'
import {isModule, Module} from '../models/module'
import {allSemesterIndices, SemesterIndex} from '../models/semester-index'
import {mapOpt} from './optional'
import {allSeasons, Season} from '../models/season'
import {allLanguages, Language} from '../models/language'

export type Parser<A> = (s: string) => A | undefined

export const parseNumber: Parser<number> = s => {
  const int = parseInt(s, undefined)
  return isNaN(int) ? undefined : int
}

export const parseDate: Parser<Date> = s => {
  const d = new Date(s)
  return isNaN(d.getTime()) ? undefined : d
}

export const parseStudyProgramAtom: Parser<StudyProgramAtom> = s =>
  isStudyProgramAtom(s) ? s : undefined

export const parseModule: Parser<Module> = s =>
  isModule(s) ? s : undefined

export const parseSemesterIndex: Parser<SemesterIndex> = s =>
  mapOpt(parseNumber(s), n => allSemesterIndices().find(si => si === n))

export const parseSeason: Parser<Season> = s =>
  allSeasons().find(sea => sea === s)

export const parseLanguage: Parser<Language> = s =>
  allLanguages().find(l => l === s)

export const parseTeachingUnit: Parser<TeachingUnit> = s =>
  isTeachingUnit(s) ? s : undefined

export const parseGraduation: Parser<Graduation> = s =>
  isGraduation(s) ? s : undefined

export const parseLecturer: Parser<Lecturer> = s =>
  isLecturer(s) ? s : undefined
