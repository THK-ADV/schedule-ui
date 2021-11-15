import {Injectable} from '@angular/core'
import {ScheduleApiService} from '../../http/schedule-api.service'
import {ScheduleFilterSelections} from '../filter/filter.component'
import {Observable} from 'rxjs'
import {ScheduleAtom} from '../../models/schedule'
import {applyFilter, atomicParams, Filter} from '../../http/http-filter'
import {inspect} from '../../utils/inspect'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly http: ScheduleApiService) {
  }

  schedules = (selection: ScheduleFilterSelections, semesterId: string): Observable<ScheduleAtom[]> =>
    this.http.schedules(applyFilter(atomicParams, this.paramsFrom(selection, semesterId)))

  private paramsFrom = (selection: ScheduleFilterSelections, semesterId: string): Filter[] => {
    const {course, teachingUnit, examReg, semesterIndex, lecturer, language} = selection
    const filter: Filter[] = []

    filter.push({key: 'semester', value: semesterId})

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

    if (language) {
      filter.push({key: 'subModule_language', value: language})
    }

    return inspect(filter)
  }
}
