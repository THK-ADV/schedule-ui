import {Injectable} from '@angular/core'
import {HttpService, parseDateStartEndFromJSON} from './http.service'
import {map} from 'rxjs/operators'
import {ScheduleAtom} from '../models/schedule'
import {HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ScheduleApiService {

  constructor(private readonly http: HttpService) {
  }

  schedules = (params: HttpParams) =>
    this.http.getAll('schedules', params)
      .pipe(map(xs => xs.map<ScheduleAtom>(parseDateStartEndFromJSON)))
}
