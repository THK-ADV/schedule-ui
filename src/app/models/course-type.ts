export type CourseType =
  'lecture' |
  'seminar' |
  'practical' |
  'exercise' |
  'tutorial' |
  'unknown'

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

export const formatShort = (c: CourseType): string => {
  switch (c) {
    case 'lecture':
      return 'V'
    case 'seminar':
      return 'S'
    case 'practical':
      return 'P'
    case 'exercise':
      return 'Ü'
    case 'tutorial':
      return 'T'
    case 'unknown':
      return '???'
  }
}
