import {Component} from '@angular/core'
import {Observable} from 'rxjs'
import {Semester} from '../../models/semester'
import {SemesterApiService} from '../../http/semester-api.service'

@Component({
  selector: 'schd-schedule-verification',
  templateUrl: './schedule-verification.component.html',
  styleUrls: ['./schedule-verification.component.scss']
})
export class ScheduleVerificationComponent {

  semester: Observable<Semester | undefined>

  constructor(private readonly semesterService: SemesterApiService) {
    this.semester = this.semesterService.draftSemester()
  }
}
