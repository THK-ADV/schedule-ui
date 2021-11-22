import {Component, OnDestroy, OnInit} from '@angular/core'
import {Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'
import {SemesterApiService} from '../http/semester-api.service'
import {Semester} from '../models/semester'
import { Course } from './filter/schedule-filter.service'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  private searchSub?: Subscription
  private semesterSub?: Subscription

  scheduleEntries: ScheduleAtom[] = []
  semester?: Semester

  constructor(
    private readonly service: ScheduleService,
    private readonly semesterService: SemesterApiService
  ) {
  }

  ngOnInit(): void {
    this.semesterSub?.unsubscribe()
    this.semesterSub = this.semesterService.currentSemester()
      .subscribe(s => this.semester = s)
  }

  ngOnDestroy(): void {
    this.semesterSub?.unsubscribe()
    this.searchSub?.unsubscribe()
  }

  searchSchedules = (courses: Course[]) => {
    this.searchSub?.unsubscribe()
    this.searchSub = this.service.schedules(courses)
      .subscribe(xs => {
        console.log(xs)
        this.scheduleEntries = xs
        this.searchSub?.unsubscribe()
      })
  }

  resetSchedules = () => {
    this.searchSub?.unsubscribe()
  }
}
