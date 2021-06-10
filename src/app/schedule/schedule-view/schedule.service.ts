import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'
import {ScheduleFilterSections} from '../filter/filter.component'
import {Observable} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'
import {applyFilter, atomicParams, ParamFilter} from '../../http/http-filter'
import {tap} from '../../utils/tap'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = (selection: ScheduleFilterSections): Observable<ScheduleAtom[]> =>
    this.http.schedules(applyFilter(this.paramsFrom(selection), atomicParams))

  private paramsFrom = (selection: ScheduleFilterSections): ParamFilter[] => {
    const {course, teachingUnit, examReg, semesterIndex, lecturer} = selection
    const filter: ParamFilter[] = []

    filter.push({attribute: 'semester', value: 'ee7d4f03-e767-4713-97d3-15a3b86eede8'})

    if (course) {
      filter.push({attribute: 'subModule', value: course.course.subModule.id})
    }

    if (lecturer) {
      filter.push({attribute: 'lecturer', value: lecturer.id})
    }

    if (teachingUnit) {
      filter.push({attribute: 'studyProgram_teachingUnit', value: teachingUnit.id})
    }

    if (examReg) {
      filter.push({attribute: 'exams', value: examReg.id})
    }

    if (semesterIndex) {
      filter.push({attribute: 'subModule_recommendedSemester', value: semesterIndex.toString()})
    }

    return tap(filter)
  }
}
