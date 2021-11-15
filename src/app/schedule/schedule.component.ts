import {Component, OnDestroy, OnInit} from '@angular/core'
import {ScheduleFilterSelections} from './filter/filter.component'
import {Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'
import {SemesterApiService} from '../http/semester-api.service'
import {Semester} from '../models/semester'

const emptySelection = (): ScheduleFilterSelections => ({
  teachingUnit: undefined,
  examReg: undefined,
  semesterIndex: undefined,
  course: undefined,
  lecturer: undefined
})

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

  filterSelection: ScheduleFilterSelections = emptySelection()

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

  searchSchedule = (semester: Semester) => {
    this.searchSub?.unsubscribe()
    this.searchSub = this.service.schedules(this.filterSelection, semester.id)
      .subscribe(xs => this.scheduleEntries = xs)
  }

  resetSchedule = () => {
    this.searchSub?.unsubscribe()
    this.filterSelection = emptySelection()
    this.scheduleEntries = []
  }
}
