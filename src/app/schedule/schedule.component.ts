import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {Observable, Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'
import {SemesterApiService} from '../http/semester-api.service'
import {Semester} from '../models/semester'
import {Course} from './filter/schedule-filter.service'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  @Input() title = 'Stundenplan'
  @Input() draftOnly = false
  @Input() semester?: Observable<Semester | undefined>

  private searchSub?: Subscription

  scheduleEntries: ScheduleAtom[] = []

  constructor(
    private readonly service: ScheduleService,
    private readonly semesterService: SemesterApiService
  ) {
  }

  ngOnInit(): void {
    if (!this.semester) {
      this.semester = this.semesterService.currentSemester()
    }
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe()
  }

  searchSchedules = (courses: Course[]) => {
    this.searchSub?.unsubscribe()
    const status = this.draftOnly ? 'draft' : 'active'
    this.searchSub = this.service.schedules(courses, status)
      .subscribe(xs => {
        this.scheduleEntries = xs
        this.searchSub?.unsubscribe()
      })
  }

  resetSchedules = () =>
    this.searchSub?.unsubscribe()
}
