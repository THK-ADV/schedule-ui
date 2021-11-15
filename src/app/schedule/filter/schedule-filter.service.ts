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

type Predicate<A> = (a: A) => boolean

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
  private readonly allSemesterIndices: SemesterIndex[] = []
  private filterState: Subject<ScheduleFilterOptions> = new Subject<ScheduleFilterOptions>()

  constructor(
    private readonly teachingUnitApi: TeachingUnitApiService,
    private readonly courseApi: CourseApiService,
    private readonly moduleExamsApi: ModuleExaminationRegulationApiService,
    private readonly userApi: UserApiService,
  ) {
    this.allSemesterIndices = allSemesterIndices().sort(this.sortSemesterIndices)
    this.fetchData()
  }

  getFilterState = (): Observable<ScheduleFilterOptions> => this.filterState.asObservable()

  private fetchData = () =>
    forkJoin({
      tu: this.teachingUnitApi.teachingUnits(),
      c: this.courseApi.coursesForCurrentSemester(),
      me: this.moduleExamsApi.moduleExams(),
      lec: this.userApi.lecturer(),
    }).subscribe((a) => {
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

      this.filterState.next({
        teachingUnits,
        semesterIndices: this.allSemesterIndices,
        lecturers: lecturer,
        courses,
        studyProgramsWithExam,
        languages: this.allLanguages
      })
    })

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

  private filter = <A>(src: A[], f: (filters: Predicate<A>[]) => void): A[] => {
    const filters: Predicate<A>[] = []
    f(filters)

    return filters.length === 0
      ? src
      : src.filter(filters.reduce((a, b) => (ss) => a(ss) && b(ss)))
  }

  updateStudyProgramsWithExam = (
    {
      teachingUnit,
      lecturer,
      course
    }: ScheduleFilterSelections): ExaminationRegulationAtom[] =>
    this.filter(this.allStudyProgramsWithExam, (filters) => {
      if (teachingUnit) {
        filters.push(e => e.studyProgram.teachingUnit.id === teachingUnit.id)
      }

      if (lecturer) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          const ls = this.lecturerByCourses(cs)
          return ls.some(_ => _.id === lecturer.id)
        })
      }

      if (course) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          return cs.some(_ => _.course.id === course.course.id)
        })
      }
    })

  updateCourses = ({teachingUnit, semesterIndex, examReg, lecturer}: ScheduleFilterSelections) =>
    this.filter(this.allCourses, (filters) => {
      if (teachingUnit) {
        filters.push(c => {
          const exams = this.examsByCourse(c)
          return exams.some(e => e.studyProgram.teachingUnit.id === teachingUnit.id)
        })
      }

      if (semesterIndex) {
        filters.push(c => c.course.subModule.recommendedSemester === semesterIndex)
      }

      if (examReg) {
        filters.push(c => {
          const exams = this.examsByCourse(c)
          return exams.some(e => e.id === examReg.id)
        })
      }

      if (lecturer) {
        filters.push(c => c.lecturer.some(_ => _.id === lecturer.id))
      }
    })

  updateLecturer = ({examReg, teachingUnit, course}: ScheduleFilterSelections): Lecturer[] =>
    this.filter(this.allLecturer, (filters) => {
      if (teachingUnit) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          const exams = this.examsByCourses(cs)
          return exams.some(e => e.studyProgram.teachingUnit.id === teachingUnit.id)
        })
      }

      if (examReg) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          const exams = this.examsByCourses(cs)
          return exams.some(e => e.id === examReg.id)
        })
      }

      if (course) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          return cs.some(_ => _.course.id === course.course.id)
        })
      }
    })

  updateTeachingUnits = ({examReg, lecturer, course}: ScheduleFilterSelections) =>
    this.filter(this.allTeachingUnits, (filters) => {
      if (examReg) {
        filters.push(tu => {
          const exams = this.examsByTeachingUnit(tu)
          return exams.some(_ => _.id === examReg.id)
        })
      }

      if (course) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(_ => _.course.id === course.course.id)
        })
      }

      if (lecturer) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(c0 => c0.lecturer.some(_ => _.id === lecturer.id))
        })
      }
    })

  updateFilters = (selections: ScheduleFilterSelections): void => {
    const studyProgramsWithExam = selections.examReg
      ? [selections.examReg]
      : this.updateStudyProgramsWithExam(selections)
    const courses = selections.course ? [selections.course] : this.updateCourses(selections)
    const lecturers = selections.lecturer ? [selections.lecturer] : this.updateLecturer(selections)
    const teachingUnits = selections.teachingUnit ? [selections.teachingUnit] : this.updateTeachingUnits(selections)
    const languages = selections.language ? [selections.language] : this.languagesByCourses(courses)
    const semesterIndices = this.allSemesterIndices

    this.filterState.next({
      studyProgramsWithExam,
      courses,
      languages,
      lecturers,
      teachingUnits,
      semesterIndices
    })
  }

  private languagesByCourses = (courses: Course[]): Language[] =>
    distinctMap(courses, ({course}) => course.subModule.language)

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
