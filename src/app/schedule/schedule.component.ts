import {Component, QueryList, ViewChildren} from '@angular/core'
import {
  Course,
  fakeCourse,
  fakeLecturer,
  fakeSemesterIndices,
  fakeStudyProgram,
  fakeTeachingUnit,
  Lecturer,
  SemesterIndex,
  StudyProgram,
  TeachingUnit
} from '../mocks'
import {FilterComponent} from './filter/filter.component'
import {HttpParams} from '@angular/common/http'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {

  @ViewChildren(FilterComponent) filterComponents!: QueryList<FilterComponent<any>>

  semesterIndices = fakeSemesterIndices

  currentTeachingUnits = fakeTeachingUnit
  allTeachingUnits = fakeTeachingUnit

  allStudyPrograms = fakeStudyProgram
  currentStudyPrograms = fakeStudyProgram

  allCourses = fakeCourse
  currentCourses = fakeCourse

  allLecturer = fakeLecturer
  currentLecturer = fakeLecturer

  private tu?: TeachingUnit
  private sp?: StudyProgram
  private si?: SemesterIndex
  private c?: Course
  private l?: Lecturer

  displayTU = (tu: TeachingUnit) => tu.label
  displaySP = (sp: StudyProgram) => sp.label
  displaySI = (si: SemesterIndex) => si.toString()
  displayC = (c: Course) => c.subModule
  displayL = (l: Lecturer) => l.lastname

  selectedTU = (tu?: TeachingUnit) => {
    this.tu = tu
    this.updateAll()
  }

  selectedSP = (sp?: StudyProgram) => {
    this.sp = sp
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
    this.updateStudyPrograms()
    this.updateCourses()
    this.updateLecturer()
    this.updateTeachingUnits()
  }

  private coursesByLecturer = (l: Lecturer) =>
    this.allCourses.filter(_ => _.lecturer === l.id)

  private studyProgramsByTeachingUnit = (tu: TeachingUnit) =>
    this.allStudyPrograms.filter(_ => _.teachingUnit === tu.id)

  private coursesByStudyProgram = (sp: StudyProgram) =>
    this.allCourses.filter(_ => _.studyProgram === sp.id)

  private coursesByStudyPrograms = (studyPrograms: StudyProgram[]) =>
    this.allCourses.filter(c => studyPrograms.some(_ => _.id === c.studyProgram))

  private studyProgramsByCourse = (c: Course) =>
    this.allStudyPrograms.filter(_ => c.studyProgram === _.id)

  private studyProgramsByCourses = (courses: Course[]) =>
    this.allStudyPrograms.filter(sp => courses.some(_ => _.studyProgram === sp.id))

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
    this.currentStudyPrograms = this.filter(this.allStudyPrograms, (filters) => {
      const tu = this.tu
      const l = this.l
      const c = this.c

      if (tu) {
        filters.push(s => s.teachingUnit === tu.id)
      }

      if (l) {
        const courses = this.coursesByLecturer(l)
        filters.push(s => courses.some(_ => _.studyProgram === s.id))
      }

      if (c) {
        filters.push(s => s.id === c.studyProgram)
      }
    })
  }

  private updateCourses = () => {
    this.currentCourses = this.filter(this.allCourses, (filters) => {
      const tu = this.tu
      const si = this.si
      const sp = this.sp
      const l = this.l

      if (tu) {
        const studyPrograms = this.studyProgramsByTeachingUnit(tu)
        filters.push(c => studyPrograms.some(_ => _.id === c.studyProgram))
      }

      if (si) {
        filters.push(c => c.semester === si)
      }

      if (sp) {
        filters.push(c => c.studyProgram === sp.id)
      }

      if (l) {
        filters.push(c => c.lecturer === l.id)
      }
    })
  }

  private updateLecturer = () => {
    this.currentLecturer = this.filter(this.allLecturer, (filters) => {
      const sp = this.sp
      const tu = this.tu
      const c = this.c

      if (tu) {
        const studyPrograms = this.studyProgramsByTeachingUnit(tu)
        const courses = this.coursesByStudyPrograms(studyPrograms)
        filters.push(l => courses.some(_ => _.lecturer === l.id))
      }

      if (sp) {
        const courses = this.coursesByStudyProgram(sp)
        filters.push(l => courses.some(_ => _.lecturer === l.id))
      }

      if (c) {
        filters.push(l => l.id === c.lecturer)
      }
    })
  }

  private updateTeachingUnits = () => {
    this.currentTeachingUnits = this.filter(this.allTeachingUnits, (filters) => {
      const sp = this.sp
      const c = this.c
      const l = this.l

      if (sp) {
        filters.push(tu => tu.id === sp.teachingUnit)
      }

      if (c) {
        const studyPrograms = this.studyProgramsByCourse(c)
        filters.push(tu => studyPrograms.some(_ => _.teachingUnit === tu.id))
      }

      if (l) {
        const courses = this.coursesByLecturer(l)
        const studyPrograms = this.studyProgramsByCourses(courses)
        filters.push(tu => studyPrograms.some(_ => _.teachingUnit === tu.id))
      }
    })
  }

  search = () => {
    const tu = this.tu
    const sp = this.sp
    const si = this.si
    const c = this.c
    const l = this.l
    let p = new HttpParams()

    if (tu) {
      console.log('aaaa', tu)
      p = p.append('teachingUnit', tu.id)
    }

    if (sp) {
      p = p.append('studyProgram', sp.id)
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
    this.sp = undefined
    this.si = undefined
    this.c = undefined
    this.l = undefined

    this.updateAll()
    this.filterComponents.forEach(a => a.reset())
  }
}
