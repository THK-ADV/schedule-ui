import {Component, OnDestroy, OnInit} from '@angular/core'
import {ScheduleService} from './schedule.service'
import {Subscription} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'

@Component({
  selector: 'schd-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit, OnDestroy {

  private sub!: Subscription
  schedules: ScheduleAtom[] = []

  constructor(private readonly service: ScheduleService) {
  }

  ngOnInit(): void {
    this.sub = this.service.schedules().subscribe(s => this.schedules = s)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
