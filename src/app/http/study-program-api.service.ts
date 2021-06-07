import {Injectable} from '@angular/core'
import {HttpService, nonAtomicParams} from './http.service'
import {Observable} from 'rxjs'
import {StudyProgram} from '../models/study-program'

@Injectable({
  providedIn: 'root'
})
export class StudyProgramApiService {

  constructor(private readonly http: HttpService) {
  }

  studyPrograms = (): Observable<StudyProgram[]> =>
    this.http.getAll('studyPrograms', nonAtomicParams)
}
