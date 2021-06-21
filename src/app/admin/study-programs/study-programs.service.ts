import {Injectable} from '@angular/core'
import {StudyProgramApiService} from '../../http/study-program-api.service'
import {Observable} from 'rxjs'
import {StudyProgramAtom} from '../../models/study-program'

@Injectable({
  providedIn: 'root'
})
export class StudyProgramsService {

  constructor(private readonly http: StudyProgramApiService) {
  }

  studyPrograms = (): Observable<StudyProgramAtom[]> =>
    this.http.studyProgramsAtomic()
}
