import {Component, Input} from '@angular/core'
import {ScheduleAtom} from '../../models/schedule'

@Component({
  selector: 'schd-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent {

  @Input() schedules: ScheduleAtom[] = []
}
