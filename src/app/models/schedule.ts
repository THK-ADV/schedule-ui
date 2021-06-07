import {Course} from './course'
import {Room} from './room'
import {Time} from './time'
import {ModuleExaminationRegulation} from './module-examination-regulation'

export interface Schedule {
  course: string,
  reservation: string,
  id: string
}

export interface ScheduleAtom {
  course: Course
  room: Room
  moduleExaminationRegulation: ModuleExaminationRegulation
  date: Date
  start: Time
  end: Time
  id: string
}
