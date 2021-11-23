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
import {CourseType, ordinal} from '../../models/course-type'
import {SemesterIndex} from '../../models/semester-index'
import {Language} from '../../models/language'
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
  courseTypes: CourseType[]
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
  private filterState: Subject<ScheduleFilterOptions> = new Subject<ScheduleFilterOptions>()

  constructor(
    private readonly teachingUnitApi: TeachingUnitApiService,
    private readonly courseApi: CourseApiService,
    private readonly moduleExamsApi: ModuleExaminationRegulationApiService,
    private readonly userApi: UserApiService,
  ) {
  }

  fetchData = (semesterId: string): Observable<ScheduleFilterOptions> => {
    forkJoin({
      tu: this.teachingUnitApi.teachingUnits(),
      c: this.courseApi.coursesForCurrentSemester(semesterId),
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
        semesterIndices: this.semesterIndicesByCourses(courses).sort(this.sortSemesterIndices),
        lecturers: lecturer,
        courses,
        studyProgramsWithExam,
        languages: this.languagesByCourses(courses).sort(this.sortLanguages),
        courseTypes: this.courseTypesByCourses(courses).sort(this.sortCourseTypes)
      })
    })

    return this.filterState.asObservable()
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

  private sortLanguages = (lhs: Language, rhs: Language) =>
    lhs.localeCompare(rhs)

  private sortCourseTypes = (lhs: CourseType, rhs: CourseType) =>
    lhs.localeCompare(rhs)

  private filter = <A>(src: A[], f: (filters: Predicate<A>[]) => void): A[] => {
    const filters: Predicate<A>[] = []
    f(filters)

    return filters.length === 0
      ? src
      : src.filter(filters.reduce((a, b) => (ss) => a(ss) && b(ss)))
  }

  updateStudyProgramsWithExam = ({
      teachingUnit,
      lecturer,
      course,
      language,
      courseType,
      semesterIndex,
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

      if (language) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          const las = this.languagesByCourses(cs)
          return las.some(lang => lang === language)
        })
      }

      if (courseType) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          return cs.some(c => c.course.courseType === courseType)
        })
      }

      if (semesterIndex) {
        filters.push(e => {
          const ms = this.modulesByStudyProgramWithExam(e)
          const cs = this.coursesByModules(ms)
          return cs.some(c => c.course.subModule.recommendedSemester === semesterIndex)
        })
      }
    })

  updateCourses = (
    {
      teachingUnit,
      semesterIndex,
      examReg,
      lecturer,
      language,
      courseType,
    }: ScheduleFilterSelections) =>
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

      if (language) {
        filters.push(c => c.course.subModule.language === language)
      }

      if (courseType) {
        filters.push(c => c.course.courseType === courseType)
      }
    })

  updateLecturer = (
    {
      examReg,
      teachingUnit,
      course,
      language,
      courseType,
      semesterIndex,
    }: ScheduleFilterSelections): Lecturer[] =>
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

      if (language) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          return cs.some(_ => _.course.subModule.language === language)
        })
      }

      if (courseType) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          return cs.some(_ => _.course.courseType === courseType)
        })
      }

      if (semesterIndex) {
        filters.push(l => {
          const cs = this.coursesByLecturer(l)
          return cs.some(_ => _.course.subModule.recommendedSemester === semesterIndex)
        })
      }
    })

  updateTeachingUnits = (
    {
      examReg,
      lecturer,
      course,
      language,
      courseType,
      semesterIndex,
    }: ScheduleFilterSelections) =>
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

      if (language) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          const las = this.languagesByCourses(cs)
          return las.some(lang => lang === language)
        })
      }

      if (courseType) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(c => c.course.courseType === courseType)
        })
      }

      if (semesterIndex) {
        filters.push(tu => {
          const ms = this.modulesByTeachingUnit(tu)
          const cs = this.coursesByModules(ms)
          return cs.some(c => c.course.subModule.recommendedSemester === semesterIndex)
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
    const languages = selections.language
      ? [selections.language]
      : this.languagesByCourses(courses).sort(this.sortLanguages)
    const courseTypes = selections.courseType
      ? [selections.courseType]
      : this.courseTypesByCourses(courses).sort(this.sortCourseTypes)
    const semesterIndices = selections.semesterIndex
      ? [selections.semesterIndex]
      : this.semesterIndicesByCourses(courses)

    this.filterState.next({
      studyProgramsWithExam,
      courses,
      languages,
      lecturers,
      teachingUnits,
      semesterIndices,
      courseTypes
    })
  }

  private languagesByCourses = (courses: Course[]): Language[] =>
    distinctMap(courses, ({course}) => course.subModule.language)

  private courseTypesByCourses = (courses: Course[]): CourseType[] =>
    distinctMap(courses, ({course}) => course.courseType)

  private semesterIndicesByCourses = (courses: Course[]): SemesterIndex[] =>
    distinctMap(courses, ({course}) => course.subModule.recommendedSemester)
      .sort(this.sortSemesterIndices)

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
