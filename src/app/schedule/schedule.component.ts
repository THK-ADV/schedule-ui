import {Component, OnDestroy, OnInit} from '@angular/core'
import {ScheduleFilterSections} from './filter/filter.component'
import {Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  private sub!: Subscription
  schedules: ScheduleAtom[] = []

  constructor(private readonly service: ScheduleService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  searchSchedule = (selection: ScheduleFilterSections) => {
    this.sub = this.service.schedules(selection)
      .subscribe(s => this.schedules = s)
  }
}
