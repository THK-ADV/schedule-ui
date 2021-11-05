import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'
import {ScheduleFilterSections} from '../filter/filter.component'
import {Observable} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'
import {applyFilter, atomicParams, Filter} from '../../http/http-filter'
import {inspect} from '../../utils/inspect'
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = (selection: ScheduleFilterSections): Observable<ScheduleAtom[]> =>
    this.http.schedules(applyFilter(atomicParams, this.paramsFrom(selection)))

  private paramsFrom = (selection: ScheduleFilterSections): Filter[] => {
    const {course, teachingUnit, examReg, semesterIndex, lecturer} = selection
    const filter: Filter[] = []

    filter.push({key: 'semester', value: environment.semesterId})

    if (course) {
      filter.push({key: 'subModule', value: course.course.subModule.id})
    }

    if (lecturer) {
      filter.push({key: 'lecturer', value: lecturer.id})
    }

    if (teachingUnit) {
      filter.push({key: 'studyProgram_teachingUnit', value: teachingUnit.id})
    }

    if (examReg) {
      filter.push({key: 'exams', value: examReg.id})
    }

    if (semesterIndex) {
      filter.push({key: 'subModule_recommendedSemester', value: semesterIndex.toString()})
    }

    return inspect(filter)
  }
}
