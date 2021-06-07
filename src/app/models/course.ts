import {Lecturer} from './user'
import {Semester} from './semester'
import {Submodule} from './submodule'

export enum CourseInterval {
  regularly,
  irregularly,
  block,
  unknown
}

export enum CourseType {
  lecture,
  practical,
  exercise,
  tutorial,
  seminar,
  unknown
}

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
