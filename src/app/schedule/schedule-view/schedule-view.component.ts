import {Component, Input} from '@angular/core'
import {ScheduleAtom} from '../../models/schedule'

export interface ScheduleViewEntry {
  s: ScheduleAtom
  subModule: string
  courseType: string
  studyProgram: string
  lecturer: string
  room: string
  date: string
  start: string
  end: string
}

@Component({
  selector: 'schd-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent {

  @Input() scheduleEntries: ScheduleViewEntry[] = []
}
