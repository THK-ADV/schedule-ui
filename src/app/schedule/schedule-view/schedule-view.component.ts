import {Component, Input, OnInit} from '@angular/core'
import {ScheduleAtom} from '../../models/schedule'
import {CalendarOptions, EventClickArg, EventContentArg} from '@fullcalendar/angular'
import {groupBy, mapGroup} from '../../utils/group-by'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {CourseType, formatShort} from '../../models/course-type'
import {formatTime} from '../../utils/date-format'

interface Event<A> {
  title: string
  start: Date
  end: Date
  backgroundColor: string
  extendedProps: {
    value: A
  }
}

type PartialEvent<A> = Pick<Event<A>, 'start' | 'end' | 'extendedProps'>

@Component({
  selector: 'schd-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit {

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
    eventMaxStack: undefined,
  }

  @Input() set scheduleEntries(xs: ScheduleAtom[]) {
    this.calendarOptions.events = this.makeEvents(xs)
  }

  ngOnInit(): void {
    this.calendarOptions.eventClick = this.onEventClick
    this.calendarOptions.eventContent = this.eventContent
    // this.calendarOptions.eventClassNames = this.eventClassNames
  }

  onEventClick = (arg: EventClickArg): void =>
    console.log('date click! ' + arg.event.title)

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

  eventContent = (arg: EventContentArg) => {
    const event = arg.event
    const a: ScheduleAtom[] = arg.event.extendedProps.value
    const studyPrograms = a
      .map(e => this.formatStudyProgram(e.moduleExaminationRegulation.examinationRegulation))
      .join(',')
    const first = a[0]
    const start = formatTime(first.start, 'HH:mm')
    const end = formatTime(first.end, 'HH:mm')

    const divEl = document.createElement('p')
    divEl.innerHTML =
      `
      <span style="font-size: x-small">${start} - ${end}</span>
      <br>
      <span>${event.title}</span>
      <br>
      <span>${studyPrograms}</span>
      `
    return {domNodes: [divEl]}
  }

  // eventClassNames = (arg: EventContentArg) => {
  //   return ['foo']
  // }

  private makeEvents = (xs: ScheduleAtom[]): PartialEvent<ScheduleAtom[]>[] => {
    const partialEvents = xs.map(x => ({
      start: x.start.date,
      end: x.end.date,
      extendedProps: {
        value: x
      },
    }))

    return this.mergeSameSlots(partialEvents)
  }

  private mergeSameSlots = (events: PartialEvent<ScheduleAtom>[]): Event<ScheduleAtom[]>[] => {
    const uniqueEventID = (e: PartialEvent<ScheduleAtom>) =>
      `${e.extendedProps.value.course.id}_${e.start.getTime()}_${e.end.getTime()}`
    const groupByCourse = groupBy(events, uniqueEventID)

    return mapGroup(groupByCourse, ((_, xs) => {
      const x = xs[0]
      const courseType = x.extendedProps.value.course.courseType
      const subModuleLabel = x.extendedProps.value.course.subModule.abbreviation
      const courseTypeLabel = formatShort(courseType)
      // const studyProgramLabel = xs
      //   .map(e => this.formatStudyProgram(e.extendedProps.value.moduleExaminationRegulation.examinationRegulation))
      //   .join(',')

      return {
        title: `${subModuleLabel} ${courseTypeLabel}`,
        start: x.start,
        end: x.end,
        backgroundColor: this.colorForCourseType(courseType),
        extendedProps: {
          value: xs.map(e => e.extendedProps.value)
        }
      }
    }))
  }

  private formatStudyProgram = (e: ExaminationRegulationAtom): string => {
    const poNumber = e.number
    const studyProgram = e.studyProgram.abbreviation
    return `${studyProgram} (${poNumber})`
  }

  private colorForCourseType = (ct: CourseType): string => {
    switch (ct) {
      case 'lecture':
        return '#fc8403'
      case 'seminar':
        return '#fcdf03'
      case 'practical':
        return '#11c255'
      case 'exercise':
        return '#0048ff'
      case 'tutorial':
        return '#9d00ff'
      case 'unknown':
        return '#ff0040'
    }
  }
}
