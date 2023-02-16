import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {map} from 'rxjs/operators'
import {ScheduleAtom} from '../models/schedule'
import {Observable} from 'rxjs'
import {applyFilter, atomicParams, Filter} from './http-filter'
import {CourseAtom} from '../models/course'
import {Room} from '../models/room'
import {ModuleExaminationRegulationAtom} from '../models/module-examination-regulation'
import {timeFromString} from '../models/time'

export interface ScheduleEntryFilter extends Filter {
  key: 'status'
}

interface ScheduleAtomJSON {
  course: CourseAtom
  room: Room
  moduleExaminationRegulation: ModuleExaminationRegulationAtom
  date: string
  start: string
  end: string
  id: string
}

export type CourseIds = string[]

@Injectable({
  providedIn: 'root'
})
export class ScheduleApiService {

  constructor(private readonly http: HttpService) {
  }

  schedules = (courseIds: CourseIds, filter?: ScheduleEntryFilter[]): Observable<ScheduleAtom[]> =>
    this.http.post<ScheduleAtomJSON>(
      'schedules/search',
      courseIds,
      applyFilter(atomicParams, filter)
    ).pipe(map(xs => xs.map(this.parse)))

  private parse = (s: ScheduleAtomJSON): ScheduleAtom => {
    const date = new Date(s.date)
    const start = timeFromString(s.start, date)
    const end = timeFromString(s.end, date)
    return {...s, date, start, end}
  }
}
