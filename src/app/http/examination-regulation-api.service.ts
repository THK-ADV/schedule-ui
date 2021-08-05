import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {applyFilter, atomicParams, Filter} from './http-filter'
import {ExaminationRegulationAtom} from '../models/examination-regulation'

export interface ExaminationRegulationFilter extends Filter {
  key: 'module'
}

@Injectable({
  providedIn: 'root'
})
export class ExaminationRegulationApiService {

  private readonly resource = 'examinationRegulations'

  constructor(private readonly http: HttpService) {
  }

  examinationRegulations = (filter?: ExaminationRegulationFilter[]): Observable<ExaminationRegulationAtom[]> =>
    this.http.getAll(this.resource, applyFilter(atomicParams, filter))
}
