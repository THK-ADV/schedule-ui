import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren} from '@angular/core'
import {FilterOptionComponent} from '../filter-option/filter-option.component'
import {Course, ScheduleFilterService} from './schedule-filter.service'
import {Subscription} from 'rxjs'
import {TeachingUnit} from '../../models/teaching-unit'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {Lecturer} from '../../models/user'
import {describeExamReg, describeLanguage, describeLecturer} from '../../utils/describe'
import {SemesterIndex} from '../../models/semester-index'
import {Language} from '../../models/language'

export interface ScheduleFilterSelections {
  teachingUnit?: TeachingUnit
  examReg?: ExaminationRegulationAtom
  semesterIndex?: SemesterIndex
  course?: Course
  lecturer?: Lecturer
  language?: Language
}

@Component({
  selector: 'schd-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  constructor(private readonly service: ScheduleFilterService) {
  }

  @ViewChildren(FilterOptionComponent) filterComponents!: QueryList<FilterOptionComponent<any>>

  @Input() selections!: ScheduleFilterSelections
  @Output() onSearch = new EventEmitter()
  @Output() onReset = new EventEmitter()

  semesterIndices: SemesterIndex[] = []
  currentTeachingUnits: TeachingUnit[] = []
  currentCourses: Course[] = []
  currentLecturer: Lecturer[] = []
  currentStudyProgramWithExam: ExaminationRegulationAtom[] = []
  currentLanguages: Language[] = []

  private sub?: Subscription

  displayL = describeLecturer

  displayER = describeExamReg

  displayLang = describeLanguage

  ngOnInit(): void {
    this.sub = this.service.filterState.subscribe(f => {
      this.semesterIndices = f.semesterIndices
      this.currentTeachingUnits = f.teachingUnits
      this.currentCourses = f.courses
      this.currentStudyProgramWithExam = f.studyProgramsWithExam
      this.currentLecturer = f.lecturers
      this.currentLanguages = f.languages
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  displayTU = (tu: TeachingUnit) =>
    tu.label

  displaySI = (si: SemesterIndex) =>
    si.toString()

  displayC = (c: Course) =>
    `${c.course.subModule.label} (${c.lecturer.map(_ => _.lastname).join(', ')})`

  selectedTU = (tu?: TeachingUnit) => {
    this.selections.teachingUnit = tu
    this.service.updateFilters(this.selections)
  }

  selectedER = (er?: ExaminationRegulationAtom) => {
    this.selections.examReg = er
    this.service.updateFilters(this.selections)
  }

  selectedSI = (si?: SemesterIndex) => {
    this.selections.semesterIndex = si
    this.service.updateFilters(this.selections)
  }

  selectedC = (c?: Course) => {
    this.selections.course = c
    this.service.updateFilters(this.selections)
  }

  selectedL = (l?: Lecturer) => {
    this.selections.lecturer = l
    this.service.updateFilters(this.selections)
  }

  selectedLang = (lang?: Language) => {
    this.selections.language = lang
    this.service.updateFilters(this.selections)
  }

  search = () =>
    this.onSearch.emit()

  reset = () => {
    this.service.updateFilters(this.selections)
    this.filterComponents.forEach(a => a.reset())
    this.onReset.emit()
  }
}
