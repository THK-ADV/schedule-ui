import {Injectable} from '@angular/core'
import {HttpService, parseDateStartEndFromJSON} from './http.service'
import {map} from 'rxjs/operators'
import {ScheduleAtom} from '../models/schedule'

@Injectable({
  providedIn: 'root'
})
export class ScheduleHttpService {

  constructor(private readonly http: HttpService) {
  }

  schedules = () =>
    this.http.getAll('schedules')
      .pipe(map(xs => xs.map<ScheduleAtom>(parseDateStartEndFromJSON)))
}
