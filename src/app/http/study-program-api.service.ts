import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../models/study-program'
import {atomicParams, nonAtomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class StudyProgramApiService {

  private readonly resource = 'studyPrograms'

  constructor(private readonly http: HttpService) {
  }

  studyPrograms = (): Observable<StudyProgram[]> =>
    this.http.getAll(this.resource, nonAtomicParams)

  studyProgramsAtomic = (): Observable<StudyProgramAtom[]> =>
    this.http.getAll(this.resource, atomicParams)

  delete = (id: string): Observable<StudyProgram> =>
    this.http.delete(`${this.resource}/${id}`)
}
