import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = () =>
    this.http.schedules()
}
