import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core'
import {FilterOptionComponent} from '../filter-option/filter-option.component'
import {HttpParams} from '@angular/common/http'
import {ScheduleFilterService, SemesterIndex} from './schedule-filter.service'
import {Subscription} from 'rxjs'
import {TeachingUnit} from '../../models/teaching-unit'
import {CourseAtom} from '../../models/course'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
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
  allTeachingUnits: TeachingUnit[] = []

  allCourses: CourseAtom[] = []
  currentCourses: CourseAtom[] = []

  allLecturer: Lecturer[] = []
  currentLecturer: Lecturer[] = []

  allModuleExams: ModuleExaminationRegulationAtom[] = []
  allExams: ExaminationRegulationAtom[] = []
  currentExams: ExaminationRegulationAtom[] = []

  sub!: Subscription

  private tu?: TeachingUnit
  private er?: ExaminationRegulationAtom
  private si?: SemesterIndex
  private c?: CourseAtom
  private l?: Lecturer

  constructor(private readonly service: ScheduleFilterService) {

  }

  ngOnInit(): void {
    this.sub = this.service.allFilters().subscribe(f => {
      const teachingUnits = f.teachingUnits
      const courses = f.courses
      const moduleExams = f.moduleExams
      const exams = f.exams
      const lecturer = f.lecturer

      this.semesterIndices = f.semesterIndices
      this.allTeachingUnits = teachingUnits
      this.currentTeachingUnits = teachingUnits
      this.allCourses = courses
      this.currentCourses = courses
      this.allExams = exams
      this.currentExams = exams
      this.allModuleExams = moduleExams
      this.allLecturer = lecturer
      this.currentLecturer = lecturer
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

  displayC = (c: CourseAtom) =>
    `${c.subModule.label} (${c.lecturer.lastname})`

  displayL = (l: Lecturer) =>
    l.lastname

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

  selectedC = (c?: CourseAtom) => {
    this.c = c
    this.updateAll()
  }

  selectedL = (l?: Lecturer) => {
    this.l = l
    this.updateAll()
  }

  private updateAll = () => {
    this.updateStudyPrograms()
    this.updateCourses()
    this.updateLecturer()
    this.updateTeachingUnits()
  }

  // private coursesByLecturer = (l: Lecturer) =>
  //   this.allCourses.filter(_ => _.lecturer.id === l.id)
  //
  // private studyProgramsByTeachingUnit = (tu: TeachingUnit) =>
  //   this.allExams.filter(_ => _.studyProgram.teachingUnit.id === tu.id)
  //
  // private coursesByStudyProgram = (er: ExaminationRegulationAtom) =>
  //   this.allCourses.filter(_ => _.studyProgram === sp.id)
  //
  // private coursesByStudyPrograms = (exams: ExaminationRegulationAtom[]) =>
  //   this.allCourses.filter(c => exams.some(_ => _.studyProgram.id === c.))
  //
  // private studyProgramsByCourse = (c: CourseAtom) =>
  //   this.allExams.filter(_ => _.studyProgram.id === c.id)
  //
  // private studyProgramsByCourses = (courses: CourseAtom[]) =>
  //   this.allExams.filter(sp => courses.some(_ => _.studyProgram === sp.studyProgram.id))

  private filter = <A>(src: A[], f: (filters: ((a: A) => boolean)[]) => void): A[] => {
    const filters: ((a: A) => boolean)[] = []
    f(filters)

    if (filters.length === 0) {
      return src
    } else {
      return src.filter(filters.reduce((a, b) => ss => a(ss) && b(ss)))
    }
  }

  private updateStudyPrograms = () => {
    // this.currentExams = this.filter(this.allExams, (filters) => {
    //   const tu = this.tu
    //   const l = this.l
    //   const c = this.c
    //
    //   if (tu) {
    //     filters.push(e => e.studyProgram.teachingUnit.id === tu.id)
    //   }
    //
    //   if (l) {
    //     const courses = this.coursesByLecturer(l)
    //
    //     // filters.push(s => courses.some(_ => _.studyProgram === s.))
    //     filters.push(e => this.allModuleExams.some(_ => _.module.id === ))
    //   }
    //
    //   if (c) {
    //     c.submodule.moduleId
    //     filters.push(s => s.)
    //   }
    // })
  }

  private updateCourses = () => {
    // this.currentCourses = this.filter(this.allCourses, (filters) => {
    //   const tu = this.tu
    //   const si = this.si
    //   const sp = this.sp
    //   const l = this.l
    //
    //   if (tu) {
    //     const studyPrograms = this.studyProgramsByTeachingUnit(tu)
    //     filters.push(c => studyPrograms.some(_ => _.id === c.studyProgram))
    //   }
    //
    //   if (si) {
    //     filters.push(c => c.semester === si)
    //   }
    //
    //   if (sp) {
    //     filters.push(c => c.studyProgram === sp.id)
    //   }
    //
    //   if (l) {
    //     filters.push(c => c.lecturer === l.id)
    //   }
    // })
  }

  private updateLecturer = () => {
    // this.currentLecturer = this.filter(this.allLecturer, (filters) => {
    //   const sp = this.sp
    //   const tu = this.tu
    //   const c = this.c
    //
    //   if (tu) {
    //     const studyPrograms = this.studyProgramsByTeachingUnit(tu)
    //     const courses = this.coursesByStudyPrograms(studyPrograms)
    //     filters.push(l => courses.some(_ => _.lecturer === l.id))
    //   }
    //
    //   if (sp) {
    //     const courses = this.coursesByStudyProgram(sp)
    //     filters.push(l => courses.some(_ => _.lecturer === l.id))
    //   }
    //
    //   if (c) {
    //     filters.push(l => l.id === c.lecturer)
    //   }
    // })
  }

  private updateTeachingUnits = () => {
    // this.currentTeachingUnits = this.filter(this.allTeachingUnits, (filters) => {
    //   const sp = this.sp
    //   const c = this.c
    //   const l = this.l
    //
    //   if (sp) {
    //     filters.push(tu => tu.id === sp.teachingUnit)
    //   }
    //
    //   if (c) {
    //     const studyPrograms = this.studyProgramsByCourse(c)
    //     filters.push(tu => studyPrograms.some(_ => _.teachingUnit === tu.id))
    //   }
    //
    //   if (l) {
    //     const courses = this.coursesByLecturer(l)
    //     const studyPrograms = this.studyProgramsByCourses(courses)
    //     filters.push(tu => studyPrograms.some(_ => _.teachingUnit === tu.id))
    //   }
    // })
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
      p = p.append('course', c.id)
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
