import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../models/study-program'
import {atomicParams, nonAtomicParams} from './http-filter'
import {StudyProgramProtocol} from '../admin/study-programs/study-programs.service'

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

  create = (p: StudyProgramProtocol): Observable<StudyProgram> =>
    this.http.create(this.resource, p)

  update = (p: StudyProgramProtocol, id: string): Observable<StudyProgram> =>
    this.http.put(`${this.resource}/${id}`, p)
}
