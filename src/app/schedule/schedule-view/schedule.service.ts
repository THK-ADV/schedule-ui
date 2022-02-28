import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'
import {Observable} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'
import {Course} from '../filter/schedule-filter.service'

export type ScheduleEntryStatus =
  | 'active'
  | 'draft'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = (
    courses: Course[],
    status: ScheduleEntryStatus
  ): Observable<ScheduleAtom[]> =>
    this.http.schedules(
      courses.map(c => c.course.id),
      [{key: 'status', value: status}]
    )
}
