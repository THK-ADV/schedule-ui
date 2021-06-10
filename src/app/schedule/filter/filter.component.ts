import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core'
import {FilterOptionComponent} from '../filter-option/filter-option.component'
import {HttpParams} from '@angular/common/http'
import {Course, ScheduleFilterService, SemesterIndex} from './schedule-filter.service'
import {Subscription} from 'rxjs'
import {TeachingUnit} from '../../models/teaching-unit'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {Lecturer} from '../../models/user'

@Component({
  selector: 'schd-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @ViewChildren(FilterOptionComponent) filterComponents!: QueryList<FilterOptionComponent<any>>

  semesterIndices: SemesterIndex[] = []
  currentTeachingUnits: TeachingUnit[] = []
  currentCourses: Course[] = []
  currentLecturer: Lecturer[] = []
  currentStudyProgramWithExam: ExaminationRegulationAtom[] = []
  sub!: Subscription

  private tu?: TeachingUnit
  private er?: ExaminationRegulationAtom
  private si?: SemesterIndex
  private c?: Course
  private l?: Lecturer

  constructor(private readonly service: ScheduleFilterService) {
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
    this.tu = tu
    this.updateAll()
  }

  selectedER = (er?: ExaminationRegulationAtom) => {
    this.er = er
    this.updateAll()
  }

  selectedSI = (si?: SemesterIndex) => {
    this.si = si
    this.updateAll()
  }

  selectedC = (c?: Course) => {
    this.c = c
    this.updateAll()
  }

  selectedL = (l?: Lecturer) => {
    this.l = l
    this.updateAll()
  }

  private updateAll = () => {
    this.currentStudyProgramWithExam = this.service.updateStudyProgramsWithExam(this.tu, this.l, this.c)
    this.currentCourses = this.service.updateCourses(this.tu, this.l, this.si, this.er)
    this.currentLecturer = this.service.updateLecturer(this.er, this.tu, this.c)
    this.currentTeachingUnits = this.service.updateTeachingUnits(this.er, this.l, this.c)
  }

  search = () => {
    const tu = this.tu
    const er = this.er
    const si = this.si
    const c = this.c
    const l = this.l
    let p = new HttpParams()

    if (tu) {
      p = p.append('teachingUnit', tu.id)
    }

    if (er) {
      p = p.append('examinationRegulation', er.id)
    }

    if (si) {
      p = p.append('semesterIndex', si.toString())
    }

    if (c) {
      p = p.append('course', c.course.id)
    }

    if (l) {
      p = p.append('lecturer', l.id)
    }

    console.log(p.toString())
  }

  reset = () => {
    this.tu = undefined
    this.er = undefined
    this.si = undefined
    this.c = undefined
    this.l = undefined

    this.updateAll()
    this.filterComponents.forEach(a => a.reset())
  }
}
