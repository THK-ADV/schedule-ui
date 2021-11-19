import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'
import {Observable} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'
import {Course} from '../filter/schedule-filter.service'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = (courses: Course[]): Observable<ScheduleAtom[]> =>
    this.http.schedules({ courseIds: this.getCourseIdsFrom(courses) })

  private getCourseIdsFrom = (courses: Course[]): string[] =>
    courses.map(c => c.course.id)
}
