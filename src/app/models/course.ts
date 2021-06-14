import {Lecturer} from './user'
import {Semester} from './semester'
import {Submodule} from './submodule'
import {CourseType} from './course-type'

export type CourseInterval =
  'regularly' |
  'irregularly' |
  'block' |
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
