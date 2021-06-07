import {Injectable} from '@angular/core'
import {atomicParams, HttpService, parseDateStartEndFromJSON} from './http.service'
import {map} from 'rxjs/operators'
import {ScheduleAtom} from '../models/schedule'

@Injectable({
  providedIn: 'root'
})
export class ScheduleApiService {

  constructor(private readonly http: HttpService) {
  }

  schedules = () =>
    this.http.getAll('schedules', atomicParams)
      .pipe(map(xs => xs.map<ScheduleAtom>(parseDateStartEndFromJSON)))
}
