import {Injectable} from '@angular/core'
import {StudyProgramApiService} from '../../http/study-program-api.service'
import {Observable, of} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../../models/study-program'

export interface StudyProgramProtocol {
  label: string
  abbreviation: string
  teachingUnit: string
  graduation: string
}

@Injectable({
  providedIn: 'root'
})
export class StudyProgramsService {

  constructor(private readonly http: StudyProgramApiService) {
  }

  studyPrograms = (): Observable<StudyProgramAtom[]> =>
    this.http.studyProgramsAtomic()

  delete = (sp: StudyProgramAtom): Observable<StudyProgramAtom> =>
    of(sp)

  create = (p: StudyProgramProtocol): Observable<StudyProgram> =>
    of({...p, id: 'random uuid'})

  update = (p: StudyProgramProtocol, id: string): Observable<StudyProgram> =>
    of({...p, id})
}
