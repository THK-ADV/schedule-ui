import {isStudyProgramAtom, StudyProgramAtom} from '../models/study-program'
import {isTeachingUnit, TeachingUnit} from '../models/teaching-unit'
import {Graduation, isGraduation} from '../models/graduation'
import {isLecturer, Lecturer} from '../models/user'

export type Parser<A> = (s: string) => A | undefined

export const parseNumber: Parser<number> = s => {
  const int = parseInt(s, undefined)
  return isNaN(int) ? undefined : int
}

export const parseStudyProgramAtom: Parser<StudyProgramAtom> = s =>
  isStudyProgramAtom(s) ? s : undefined

export const parseTeachingUnit: Parser<TeachingUnit> = s =>
  isTeachingUnit(s) ? s : undefined

export const parseGraduation: Parser<Graduation> = s =>
  isGraduation(s) ? s : undefined

export const parseLecturer: Parser<Lecturer> = s =>
  isLecturer(s) ? s : undefined

export const parseDate: Parser<Date> = s => {
  const d = new Date(s)
  return isNaN(d.getTime()) ? undefined : d
}
