import {Injectable} from '@angular/core'
import {TeachingUnitApiService} from '../../http/teaching-unit-api.service'
import {TeachingUnit} from '../../models/teaching-unit'
import {forkJoin, Observable, Subject} from 'rxjs'
import {CourseApiService} from '../../http/course-api.service'
import {CourseAtom} from '../../models/course'
import {ModuleExaminationRegulationApiService} from '../../http/module-examination-regulation-api.service'
import {ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
import {Lecturer} from '../../models/user'
import {UserApiService} from '../../http/user-api.service'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {distinctBy, distinctMap} from '../../utils/array-ops'
import {Module} from '../../models/module'
import {groupBy, mapGroup} from '../../utils/group-by'
import {ordinal} from '../../models/course-type'
import {allSemesterIndices, SemesterIndex} from '../../models/semester-index'
import {allLanguages, Language} from '../../models/language'
import {ScheduleFilterSelections} from './filter.component'

export interface Course {
  course: Omit<CourseAtom, 'lecturer'>
  lecturer: Lecturer[]
}

export interface ScheduleFilterOptions {
  teachingUnits: TeachingUnit[]
  semesterIndices: SemesterIndex[]
  courses: Course[]
  studyProgramsWithExam: ExaminationRegulationAtom[]
  lecturers: Lecturer[]
  languages: Language[]
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
  private allLanguages: Language[] = allLanguages()
  private allSemesterIndices: SemesterIndex[] = []
  private filterState$: Subject<ScheduleFilterOptions> = new Subject<ScheduleFilterOptions>()
  filterState: Observable<ScheduleFilterOptions>

  constructor(
    private readonly teachingUnitApi: TeachingUnitApiService,
    private readonly courseApi: CourseApiService,
    private readonly moduleExamsApi: ModuleExaminationRegulationApiService,
    private readonly userApi: UserApiService,
  ) {
    this.allSemesterIndices = allSemesterIndices().sort(this.sortSemesterIndices)
    this.filterState = this.filterState$.asObservable()
    this.fetchData()
  }

  private fetchData = () => {
    const observables = forkJoin({
      tu: this.teachingUnitApi.teachingUnits(),
      c: this.courseApi.coursesForCurrentSemester(),
      me: this.moduleExamsApi.moduleExams(),
      lec: this.userApi.lecturer(),
    })

    observables.subscribe((a) => {
      const moduleExams = a.me
      const studyProgramsWithExam = distinctBy(moduleExams.map(_ => _.examinationRegulation), e => e.id)
        .sort(this.sortExams)
      const courses = this.distinctCourses(a.c).sort(this.sortCourses)
      const lecturer = a.lec.sort(this.sortLecturer)
      const teachingUnits = a.tu.sort(this.sortTeachingUnits)

      this.allTeachingUnits = teachingUnits
      this.allCourses = courses
      this.allLecturer = lecturer
      this.allModuleExams = moduleExams
      this.allStudyProgramsWithExam = studyProgramsWithExam

      this.filterState$.next({
        teachingUnits,
        semesterIndices: this.allSemesterIndices,
        lecturers: lecturer,
        courses,
        studyProgramsWithExam,
        languages: this.allLanguages
      })
    })
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
    c?: Course,
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

  private getLanguages = (courses: Course[]): Language[] =>
    distinctMap(courses, ({ course }) => course.subModule.language)

  updateFilters = (filterSelections: ScheduleFilterSelections): void => {
    const {course, semesterIndex, examReg, lecturer, teachingUnit} = filterSelections

    const studyProgramsWithExam = this.updateStudyProgramsWithExam(teachingUnit, lecturer, course)
    const courses = this.updateCourses(teachingUnit, lecturer, semesterIndex, examReg)
    const lecturers = this.updateLecturer(examReg, teachingUnit, course)
    const teachingUnits = this.updateTeachingUnits(examReg, lecturer, course)
    const languages = this.getLanguages(courses)

    this.filterState$.next({
      studyProgramsWithExam,
      courses,
      languages,
      lecturers,
      teachingUnits,
      semesterIndices: this.allSemesterIndices
    })
  }

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
