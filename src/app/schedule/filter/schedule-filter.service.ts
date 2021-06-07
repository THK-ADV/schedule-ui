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

export type SemesterIndex = 1 | 2 | 3 | 4 | 5 | 6

export interface ScheduleFilterOptions {
  teachingUnits: TeachingUnit[]
  semesterIndices: SemesterIndex[]
  courses: CourseAtom[]
  moduleExams: ModuleExaminationRegulationAtom[]
  exams: ExaminationRegulationAtom[]
  lecturer: Lecturer[]
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleFilterService {

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
      si: of<SemesterIndex[]>([1, 2, 3, 4, 5, 6])
    })

    return observables.pipe(map(a => {
      const moduleExams = a.me
      const exams = distinctBy(moduleExams.map(_ => _.examinationRegulation), e => e.id)
        .sort(this.sortExams)
      const courses = distinctBy(a.c, _ => _.subModule.id)
        .sort(this.sortCourses)
      const lecturer = a.lec.sort(this.sortLecturer)
      const teachingUnits = a.tu.sort(this.sortTeachingUnits)
      const semesterIndices = a.si.sort(this.sortSemesterIndices)

      return {
        teachingUnits,
        semesterIndices,
        lecturer,
        courses,
        moduleExams,
        exams
      }
    }))
  }

  private sortExams = (lhs: ExaminationRegulationAtom, rhs: ExaminationRegulationAtom): number =>
    lhs.studyProgram.label.localeCompare(rhs.studyProgram.label) || lhs.number - rhs.number

  private sortCourses = (lhs: CourseAtom, rhs: CourseAtom) =>
    lhs.subModule.label.localeCompare(rhs.subModule.label)

  private sortLecturer = (lhs: Lecturer, rhs: Lecturer) =>
    lhs.lastname.localeCompare(rhs.lastname) || lhs.firstname.localeCompare(rhs.firstname)

  private sortTeachingUnits = (lhs: TeachingUnit, rhs: TeachingUnit) =>
    lhs.number - rhs.number

  private sortSemesterIndices = (lhs: SemesterIndex, rhs: SemesterIndex) =>
    lhs - rhs
}
