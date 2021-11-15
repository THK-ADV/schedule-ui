import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {applyFilter, atomicParams, Filter} from './http-filter'
import {ExaminationRegulation, ExaminationRegulationAtom} from '../models/examination-regulation'
import {ExaminationRegulationProtocol} from '../admin/examination-regulations/examination-regulations.service'

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

  delete = (id: string): Observable<ExaminationRegulation> =>
    this.http.delete(`${this.resource}/${id}`)

  create = (p: ExaminationRegulationProtocol): Observable<ExaminationRegulation> =>
    this.http.create(this.resource, p)

  update = (p: ExaminationRegulationProtocol, id: string): Observable<ExaminationRegulation> =>
    this.http.put(`${this.resource}/${id}`, p)
}
