import {Injectable} from '@angular/core'
import {TeachingUnitApiService} from '../../http/teaching-unit-api.service'
import {TeachingUnit} from '../../models/teaching-unit'
import {forkJoin, Observable, of} from 'rxjs'
import {map} from 'rxjs/operators'
import {CourseApiService} from '../../http/course-api.service'
import {CourseAtom} from '../../models/course'
import {ModuleExaminationRegulationApiService} from '../../http/module-examination-regulation-api.service'
import {ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
import {Lecturer} from '../../models/user'
import {UserApiService} from '../../http/user-api.service'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {distinctBy} from '../../utils/array-ops'
import {Module} from '../../models/module'
import {groupBy, mapGroup} from '../../utils/group-by'
import {ordinal} from '../../models/course-type'
import {allSemesterIndices, SemesterIndex} from '../../models/semester-index'

export interface Course {
  course: Omit<CourseAtom, 'lecturer'>
  lecturer: Lecturer[]
}

export interface ScheduleFilterOptions {
  teachingUnits: TeachingUnit[]
  semesterIndices: SemesterIndex[]
  courses: Course[]
  studyProgramsWithExam: ExaminationRegulationAtom[]
  lecturer: Lecturer[]
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleFilterService {

  private allTeachingUnits: TeachingUnit[] = []
  private allCourses: Course[] = []
  private allLecturer: Lecturer[] = []
  private allModuleExams: ModuleExaminationRegulationAtom[] = []
  private allStudyProgramsWithExam: ExaminationRegulationAtom[] = []

  constructor(
    private readonly teachingUnitApi: TeachingUnitApiService,
    private readonly courseApi: CourseApiService,
    private readonly moduleExamsApi: ModuleExaminationRegulationApiService,
    private readonly userApi: UserApiService,
  ) {
  }

  allFilters = (): Observable<ScheduleFilterOptions> => {
    const observables = forkJoin({
      tu: this.teachingUnitApi.teachingUnits(),
      c: this.courseApi.coursesForCurrentSemester(),
      me: this.moduleExamsApi.moduleExams(),
      lec: this.userApi.lecturer(),
      si: of(allSemesterIndices())
    })

    return observables.pipe(map(a => {
      const moduleExams = a.me
      const studyProgramsWithExam = distinctBy(moduleExams.map(_ => _.examinationRegulation), e => e.id)
        .sort(this.sortExams)
      const courses = this.distinctCourses(a.c).sort(this.sortCourses)
      const lecturer = a.lec.sort(this.sortLecturer)
      const teachingUnits = a.tu.sort(this.sortTeachingUnits)
      const semesterIndices = a.si.sort(this.sortSemesterIndices)

      this.allTeachingUnits = teachingUnits
      this.allCourses = courses
      this.allLecturer = lecturer
      this.allModuleExams = moduleExams
      this.allStudyProgramsWithExam = studyProgramsWithExam

      return {
        teachingUnits,
        semesterIndices,
        lecturer,
        courses,
        studyProgramsWithExam
      }
    }))
  }

  private distinctCourses = (cs: CourseAtom[]): Course[] =>
    mapGroup(
      groupBy(cs, c => c.subModule.id),
      (_, courses) => {
        return {
          course: {...(courses[0])},
          lecturer: this.sortCoursesByCourseType(distinctBy(courses, c => c.lecturer.id))
            .map(c => c.lecturer)
        }
      }
    )

  private sortCoursesByCourseType = (cs: CourseAtom[]): CourseAtom[] =>
    cs.sort((lhs, rhs) => ordinal(lhs.courseType) - ordinal(rhs.courseType))

  private sortExams = (lhs: ExaminationRegulationAtom, rhs: ExaminationRegulationAtom): number =>
    lhs.studyProgram.label.localeCompare(rhs.studyProgram.label) || lhs.number - rhs.number

  private sortCourses = (lhs: Course, rhs: Course) =>
    lhs.course.subModule.label.localeCompare(rhs.course.subModule.label)

  private sortLecturer = (lhs: Lecturer, rhs: Lecturer) =>
    lhs.lastname.localeCompare(rhs.lastname) || lhs.firstname.localeCompare(rhs.firstname)

  private sortTeachingUnits = (lhs: TeachingUnit, rhs: TeachingUnit) =>
    lhs.number - rhs.number

  private sortSemesterIndices = (lhs: SemesterIndex, rhs: SemesterIndex) =>
    lhs - rhs

  private filter = <A>(src: A[], f: (filters: ((a: A) => boolean)[]) => void): A[] => {
    const filters: ((a: A) => boolean)[] = []
    f(filters)

    if (filters.length === 0) {
      return src
    } else {
      return src.filter(filters.reduce((a, b) => (ss) => a(ss) && b(ss)))
    }
  }

  updateStudyProgramsWithExam = (
    tu?: TeachingUnit,
    l?: Lecturer,
    c?: Course
  ): ExaminationRegulationAtom[] =>
    this.filter(this.allStudyProgramsWithExam, (filters) => {
      if (tu) {
        filters.push(e => e.studyProgram.teachingUnit.id === tu.id)
      }

      if (l) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          const ls = this.lecturerByCourses(cs)
          return ls.some(_ => _.id === l.id)
        })
      }

      if (c) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          return cs.some(_ => _.course.id === c.course.id)
        })
      }
    })

  updateCourses = (tu?: TeachingUnit, l?: Lecturer, si?: SemesterIndex, er?: ExaminationRegulationAtom) =>
    this.filter(this.allCourses, (filters) => {
      if (tu) {
        filters.push(c => {
          const exams = this.examsByCourse(c)
          return exams.some(e => e.studyProgram.teachingUnit.id === tu.id)
        })
      }

      if (si) {
        filters.push(c => c.course.subModule.recommendedSemester === si)
      }

      if (er) {
        filters.push(c => {
          const exams = this.examsByCourse(c)
          return exams.some(e => e.id === er.id)
        })
      }

      if (l) {
        filters.push(c => c.lecturer.some(_ => _.id === l.id))
      }
    })

  updateLecturer = (er?: ExaminationRegulationAtom, tu?: TeachingUnit, c?: Course): Lecturer[] =>
    this.filter(this.allLecturer, (filters) => {
      if (tu) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          const exams = this.examsByCourses(cs)
          return exams.some(e => e.studyProgram.teachingUnit.id === tu.id)
        })
      }

      if (er) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          const exams = this.examsByCourses(cs)
          return exams.some(e => e.id === er.id)
        })
      }

      if (c) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          return cs.some(_ => _.course.id === c.course.id)
        })
      }
    })

  updateTeachingUnits = (er?: ExaminationRegulationAtom, l?: Lecturer, c?: Course) =>
    this.filter(this.allTeachingUnits, (filters) => {
      if (er) {
        filters.push(tu => {
          const exams = this.examsByTeachingUnit(tu)
          return exams.some(_ => _.id === er.id)
        })
      }

      if (c) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(_ => _.course.id === c.course.id)
        })
      }

      if (l) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(c0 => c0.lecturer.some(_ => _.id === l.id))
        })
      }
    })

  private examsByTeachingUnit = (tu: TeachingUnit): ExaminationRegulationAtom[] =>
    this.allStudyProgramsWithExam.filter(e => e.studyProgram.teachingUnit.id === tu.id)

  private modulesByTeachingUnit = (tu: TeachingUnit): Module[] =>
    this.allModuleExams
      .filter(me => me.examinationRegulation.studyProgram.teachingUnit.id === tu.id)
      .map(_ => _.module)

  private modulesByStudyProgramWithExam = (e: ExaminationRegulationAtom): Module[] =>
    this.allModuleExams
      .filter(me => me.examinationRegulation.id === e.id)
      .map(_ => _.module)

  private coursesByModules = (ms: Module[]): Course[] =>
    this.allCourses.filter(c => ms.some(m => m.id === c.course.subModule.module))

  private lecturerByCourses = (cs: Course[]): Lecturer[] =>
    this.allLecturer.filter(l => cs.some(c => c.lecturer.some(_ => _.id === l.id)))

  private examsByCourse = (c: Course): ExaminationRegulationAtom[] =>
    this.allModuleExams
      .filter(me => me.module.id === c.course.subModule.module)
      .map(_ => _.examinationRegulation)

  private examsByCourses = (cs: Course[]): ExaminationRegulationAtom[] =>
    this.allModuleExams
      .filter(me => cs.some(c => c.course.subModule.module === me.module.id))
      .map(_ => _.examinationRegulation)

  private coursesByLecturer = (l: Lecturer): Course[] =>
    this.allCourses.filter(c => c.lecturer.some(_ => _.id === l.id))
}
