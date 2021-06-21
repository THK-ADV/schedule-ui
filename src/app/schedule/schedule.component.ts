import {Component, OnDestroy} from '@angular/core'
import {ScheduleFilterSections} from './filter/filter.component'
import {Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'

const emptySelection = (): ScheduleFilterSections => ({
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
export class ScheduleComponent implements OnDestroy {

  private sub?: Subscription

  scheduleEntries: ScheduleAtom[] = []

  filterSelection: ScheduleFilterSections = emptySelection()

  constructor(private readonly service: ScheduleService) {
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  searchSchedule = () => {
    this.sub = this.service.schedules(this.filterSelection)
      .subscribe(xs => this.scheduleEntries = xs)
  }

  resetSchedule = () => {
    this.filterSelection = emptySelection()
    this.scheduleEntries = []
  }
}
