import {Injectable} from '@angular/core'
import {ScheduleHttpService} from '../../http/schedule-http.service'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleHttpService) {
  }

  schedules = () =>
    this.http.schedules()
}
