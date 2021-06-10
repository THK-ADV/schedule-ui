import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {StudyProgram} from '../models/study-program'
import {nonAtomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class StudyProgramApiService {

  constructor(private readonly http: HttpService) {
  }

  studyPrograms = (): Observable<StudyProgram[]> =>
    this.http.getAll('studyPrograms', nonAtomicParams)
}
