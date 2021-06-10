import {Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren} from '@angular/core'
import {FilterOptionComponent} from '../filter-option/filter-option.component'
import {Course, ScheduleFilterService, SemesterIndex} from './schedule-filter.service'
import {Subscription} from 'rxjs'
import {TeachingUnit} from '../../models/teaching-unit'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {Lecturer} from '../../models/user'

export interface ScheduleFilterSections {
  teachingUnit?: TeachingUnit
  examReg?: ExaminationRegulationAtom
  semesterIndex?: SemesterIndex
  course?: Course
  lecturer?: Lecturer
}

const emptyScheduleFilterSections = (): ScheduleFilterSections => ({
  teachingUnit: undefined,
  examReg: undefined,
  semesterIndex: undefined,
  course: undefined,
  lecturer: undefined
})

@Component({
  selector: 'schd-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @ViewChildren(FilterOptionComponent) filterComponents!: QueryList<FilterOptionComponent<any>>

  @Output() onSearch = new EventEmitter<ScheduleFilterSections>()
  @Output() onReset = new EventEmitter()

  semesterIndices: SemesterIndex[] = []
  currentTeachingUnits: TeachingUnit[] = []
  currentCourses: Course[] = []
  currentLecturer: Lecturer[] = []
  currentStudyProgramWithExam: ExaminationRegulationAtom[] = []

  private sub!: Subscription

  private selections: ScheduleFilterSections

  constructor(private readonly service: ScheduleFilterService) {
    this.selections = emptyScheduleFilterSections()
  }

  ngOnInit(): void {
    this.sub = this.service.allFilters().subscribe(f => {
      this.semesterIndices = f.semesterIndices
      this.currentTeachingUnits = f.teachingUnits
      this.currentCourses = f.courses
      this.currentStudyProgramWithExam = f.studyProgramsWithExam
      this.currentLecturer = f.lecturer
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  displayTU = (tu: TeachingUnit) =>
    tu.label

  displayER = (er: ExaminationRegulationAtom) =>
    `${er.studyProgram.label} (${er.studyProgram.graduation.abbreviation} ${er.number})`

  displaySI = (si: SemesterIndex) =>
    si.toString()

  displayC = (c: Course) =>
    `${c.course.subModule.label} (${c.lecturer.map(_ => _.lastname).join(', ')})`

  displayL = (l: Lecturer) =>
    `${l.lastname}, ${l.firstname} (${l.initials})`

  selectedTU = (tu?: TeachingUnit) => {
    this.selections.teachingUnit = tu
    this.updateAll()
  }

  selectedER = (er?: ExaminationRegulationAtom) => {
    this.selections.examReg = er
    this.updateAll()
  }

  selectedSI = (si?: SemesterIndex) => {
    this.selections.semesterIndex = si
    this.updateAll()
  }

  selectedC = (c?: Course) => {
    this.selections.course = c
    this.updateAll()
  }

  selectedL = (l?: Lecturer) => {
    this.selections.lecturer = l
    this.updateAll()
  }

  private updateAll = () => {
    const {course, semesterIndex, examReg, lecturer, teachingUnit} = this.selections
    this.currentStudyProgramWithExam = this.service.updateStudyProgramsWithExam(teachingUnit, lecturer, course)
    this.currentCourses = this.service.updateCourses(teachingUnit, lecturer, semesterIndex, examReg)
    this.currentLecturer = this.service.updateLecturer(examReg, teachingUnit, course)
    this.currentTeachingUnits = this.service.updateTeachingUnits(examReg, lecturer, course)
  }

  search = () =>
    this.onSearch.emit(this.selections)

  reset = () => {
    this.selections = emptyScheduleFilterSections()
    this.updateAll()
    this.filterComponents.forEach(a => a.reset())
    this.onReset.emit()
  }
}
