import {Lecturer} from './user'
import {Semester} from './semester'
import {Submodule} from './submodule'

export type CourseInterval =
  'regularly' |
  'irregularly' |
  'block' |
  'unknown'

export type CourseType =
  'lecture' |
  'seminar' |
  'practical' |
  'exercise' |
  'tutorial' |
  'unknown'

export interface Course {
  interval: CourseInterval
  courseType: CourseType
  lecturer: string
  semester: string
  subModule: string
  id: string
}

export interface CourseAtom {
  interval: CourseInterval
  courseType: CourseType
  lecturer: Lecturer
  semester: Semester
  subModule: Submodule
  id: string
}

export const ordinal = (c: CourseType): number => {
  switch (c) {
    case 'lecture':
      return 1
    case 'seminar':
      return 2
    case 'practical':
      return 3
    case 'exercise':
      return 4
    case 'tutorial':
      return 5
    case 'unknown':
      return 6
  }
}

export const formatLong = (c: CourseType): string => {
  switch (c) {
    case 'lecture':
      return 'Vorlesung'
    case 'seminar':
      return 'Seminar'
    case 'practical':
      return 'Praktikum'
    case 'exercise':
      return 'Übung'
    case 'tutorial':
      return 'Tutorium'
    case 'unknown':
      return 'Unbekannt'
  }
}
