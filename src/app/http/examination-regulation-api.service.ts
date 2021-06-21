import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {atomicParams} from './http-filter'
import {ExaminationRegulationAtom} from '../models/examination-regulation'

@Injectable({
  providedIn: 'root'
})
export class ExaminationRegulationApiService {

  private readonly resource = 'examinationRegulations'

  constructor(private readonly http: HttpService) {
  }

  examinationRegulations = (): Observable<ExaminationRegulationAtom[]> =>
    this.http.getAll(this.resource, atomicParams)
}
