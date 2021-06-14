import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {ScheduleAtom} from '../../models/schedule'
import {CalendarOptions, EventClickArg} from '@fullcalendar/angular'
import {EMPTY, Observable, Subscription} from 'rxjs'
import {formatShort} from '../../models/course'
import {groupBy, mapGroup} from '../../utils/group-by'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'

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

interface Event<A> {
  title: string
  start: Date
  end: Date
  extendedProps: A
}

@Component({
  selector: 'schd-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit, OnDestroy {

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    allDaySlot: false,
    editable: false,
    locale: 'de',
    weekends: false,
    nowIndicator: true,
    dayHeaderFormat: {weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true},
    slotDuration: '00:15:00',
    slotLabelInterval: {hours: 1},
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: true,
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    height: 'auto',
    weekNumbers: true,
    weekText: 'KW',
    slotEventOverlap: false,
    eventMaxStack: undefined
  }

  private sub!: Subscription

  @Input() scheduleEntries: Observable<ScheduleAtom[]> = EMPTY

  ngOnInit(): void {
    this.calendarOptions.eventClick = this.handleDateClick
    // this.calendarOptions.eventContent = this.eventContent
    // this.calendarOptions.eventClassNames = this.eventClassNames
    this.sub = this.scheduleEntries.subscribe(xs => {
      if (xs) {
        this.calendarOptions.events = this.makeEvents(xs)
      } else {
        this.calendarOptions.events = []
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  handleDateClick = (arg: EventClickArg): void =>
    console.log('date click! ' + arg.event.start)

  /*
  eventContent: function(arg) {
	let divEl = document.createElement('div')
	let htmlTitle = arg.event._def.extendedProps['html'];
	if (arg.event.extendedProps.isHTML) {
		divEl.innerHTML = htmlTitle
	} else {
		divEl.innerHTML = arg.event.title
	}
	let arrayOfDomNodes = [ divEl ]
	return { domNodes: arrayOfDomNodes }
}
   */
  // eventContent = (arg: EventContentArg) => {
  //   const event = arg.event
  //   const a: ScheduleAtom[] = arg.event.extendedProps.a
  //   const b: number = arg.event.extendedProps.b
  //   const studyPrograms = a
  //     .map(e => this.formatStudyProgram(e.moduleExaminationRegulation.examinationRegulation))
  //     .join(',')
  //   const divEl = document.createElement('div')
  //   divEl.innerHTML = `<p>${event.title}<br>${studyPrograms}</p>`
  //   return { domNodes: [divEl] }
  // }
  //
  // eventClassNames = (arg: EventContentArg) => {
  //   return ['foo']
  // }

  private makeEvents = (xs: ScheduleAtom[]): Event<ScheduleAtom[]>[] => {
    const allEvents = xs.map(x => {
      const subModule = x.course.subModule
      const studyProgram = x.moduleExaminationRegulation.examinationRegulation.studyProgram
      return {
        title: `${subModule.abbreviation} ${formatShort(x.course.courseType)} ${studyProgram.abbreviation}`,
        start: x.start.date,
        end: x.end.date,
        extendedProps: x,
      }
    })

    return this.mergeSameSlots(allEvents)
  }

  private mergeSameSlots = (events: Event<ScheduleAtom>[]): Event<ScheduleAtom[]>[] => {
    const uniqueEventID = (e: Event<ScheduleAtom>) =>
      `${e.extendedProps.course.id}_${e.start.getTime()}_${e.end.getTime()}`
    const groupByCourse = groupBy(events, uniqueEventID)

    return mapGroup(groupByCourse, ((_, xs) => {
      const x = xs[0]
      const subModule = x.extendedProps.course.subModule.abbreviation
      const courseType = formatShort(x.extendedProps.course.courseType)
      const courseInfo = `${subModule} ${courseType}`
      const studyPrograms = xs
        .map(e => this.formatStudyProgram(e.extendedProps.moduleExaminationRegulation.examinationRegulation))
        .join(',')

      return {
        title: `${courseInfo} ${studyPrograms}`,
        start: x.start,
        end: x.end,
        extendedProps: xs.map(e => e.extendedProps)
      }
    }))
  }

  private formatStudyProgram = (e: ExaminationRegulationAtom): string => {
    const poNumber = e.number
    const studyProgram = e.studyProgram.abbreviation
    return `${studyProgram} (${poNumber})`
  }
}
