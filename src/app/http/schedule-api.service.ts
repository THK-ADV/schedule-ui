import {Injectable} from '@angular/core'
import {HttpService, parseDateStartEndFromJSON} from './http.service'
import {map} from 'rxjs/operators'
import {ScheduleAtom} from '../models/schedule'
import {Observable} from 'rxjs'
import {atomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class ScheduleApiService {

  constructor(private readonly http: HttpService) {
  }

  schedules = (body: unknown): Observable<ScheduleAtom[]> =>
    this.http.post('schedules/search', body, atomicParams)
      .pipe(map(xs => xs.map<ScheduleAtom>(parseDateStartEndFromJSON)))
}
