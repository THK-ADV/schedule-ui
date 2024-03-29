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
import {Semester} from '../../models/semester'
import {CourseType, formatLong as describeCourse} from '../../models/course-type'

export interface ScheduleFilterSelections {
  teachingUnit?: TeachingUnit
  examReg?: ExaminationRegulationAtom
  semesterIndex?: SemesterIndex
  course?: Course
  lecturer?: Lecturer
  language?: Language
  courseType?: CourseType
}

@Component({
  selector: 'schd-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  constructor(private readonly service: ScheduleFilterService) {
  }

  @ViewChildren(FilterOptionComponent) filterComponents!: QueryList<FilterOptionComponent<unknown>>

  @Input() semester!: Semester
  @Output() searchEvent = new EventEmitter<Course[]>()
  @Output() resetEvent = new EventEmitter()

  selections: ScheduleFilterSelections = {}
  semesterIndices: SemesterIndex[] = []
  currentTeachingUnits: TeachingUnit[] = []
  currentCourses: Course[] = []
  currentLecturer: Lecturer[] = []
  currentStudyProgramWithExam: ExaminationRegulationAtom[] = []
  currentLanguages: Language[] = []
  currentCourseTypes: CourseType[] = []

  private sub?: Subscription

  displayL = describeLecturer

  displayER = describeExamReg

  displayLang = describeLanguage

  displayCourseType = describeCourse

  ngOnInit(): void {
    this.sub = this.service.fetchData(this.semester.id).subscribe(f => {
      this.semesterIndices = f.semesterIndices
      this.currentTeachingUnits = f.teachingUnits
      this.currentCourses = f.courses
      this.currentStudyProgramWithExam = f.studyProgramsWithExam
      this.currentLecturer = f.lecturers
      this.currentLanguages = f.languages
      this.currentCourseTypes = f.courseTypes

      this.searchEvent.emit(f.courses)
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

  selectedCourseType = (ct?: CourseType) => {
    this.selections.courseType = ct
    this.service.updateFilters(this.selections)
  }

  search = () =>
    this.searchEvent.emit(this.currentCourses)

  reset = () => {
    this.filterComponents.forEach(a => a.reset())
    this.service.updateFilters({})
    this.resetEvent.emit()
  }
}
