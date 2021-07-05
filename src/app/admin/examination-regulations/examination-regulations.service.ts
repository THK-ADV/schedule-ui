import {Injectable} from '@angular/core'
import {ExaminationRegulationApiService} from '../../http/examination-regulation-api.service'
import {Observable, of} from 'rxjs'
import {ExaminationRegulation, ExaminationRegulationAtom} from '../../models/examination-regulation'

export interface ExaminationRegulationProtocol {
  studyProgram: string
  number: number
  start: Date
  end?: Date
}

@Injectable({
  providedIn: 'root'
})
export class ExaminationRegulationsService {

  constructor(private readonly http: ExaminationRegulationApiService) {
  }

  examinationRegulations = () =>
    this.http.examinationRegulations()

  delete = (e: ExaminationRegulationAtom): Observable<ExaminationRegulationAtom> =>
    of(e)

  create = (e: ExaminationRegulationProtocol): Observable<ExaminationRegulation> =>
    of({...e, id: 'random uuid'})

  update = (e: ExaminationRegulationProtocol, id: string): Observable<ExaminationRegulation> =>
    of({...e, id})
}
