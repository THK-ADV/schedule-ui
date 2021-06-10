import {CourseAtom} from './course'
import {Room} from './room'
import {Time} from './time'
import {ModuleExaminationRegulationAtom} from './module-examination-regulation'

export interface Schedule {
  course: string,
  reservation: string,
  id: string
}

export interface ScheduleAtom {
  course: CourseAtom
  room: Room
  moduleExaminationRegulation: ModuleExaminationRegulationAtom
  date: Date
  start: Time
  end: Time
  id: string
}
