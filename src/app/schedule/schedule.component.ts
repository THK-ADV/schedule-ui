import {Component, OnDestroy, OnInit} from '@angular/core'
import {ScheduleFilterSections} from './filter/filter.component'
import {Subject, Subscription} from 'rxjs'
import {ScheduleAtom} from '../models/schedule'
import {ScheduleService} from './schedule-view/schedule.service'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  private sub!: Subscription
  scheduleEntries = new Subject<ScheduleAtom[]>()

  constructor(private readonly service: ScheduleService) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  searchSchedule = (selection: ScheduleFilterSections) => {
    this.sub = this.service.schedules(selection)
      .subscribe(xs => this.scheduleEntries.next(xs))
  }

  resetSchedule = () =>
    this.scheduleEntries.next(undefined)

  // private toScheduleView = (schedules: ScheduleAtom[]): ScheduleViewEntry[] =>
  //   schedules.map(s => {
  //     const examReg = s.moduleExaminationRegulation.examinationRegulation
  //     const studyProgram = examReg.studyProgram
  //     const subModule = s.course.subModule
  //     const lecturer = s.course.lecturer
  //
  //     return ({
  //       s,
  //       subModule: `${subModule.label} (${subModule.abbreviation})`,
  //       studyProgram: `${studyProgram.label} (${studyProgram.graduation.abbreviation} ${examReg.number})`,
  //       lecturer: `${lecturer.lastname}, ${lecturer.firstname}`,
  //       courseType: formatLong(s.course.courseType),
  //       room: s.room.abbreviation,
  //       date: formatDate(s.date, 'dd.MM.yyyy'),
  //       start: formatTime(s.start, 'HH:mm'),
  //       end: formatTime(s.end, 'HH:mm')
  //     })
  //   })
}
