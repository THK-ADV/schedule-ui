import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {ModuleExaminationRegulation, ModuleExaminationRegulationAtom} from '../models/module-examination-regulation'
import {atomicParams} from './http-filter'
import {ModuleExaminationRegulationProtocol} from '../admin/module-examination-regulations/module-examination-regulation.service'

@Injectable({
  providedIn: 'root'
})
export class ModuleExaminationRegulationApiService {

  private readonly resource = 'moduleExaminationRegulations'

  constructor(private readonly http: HttpService) {
  }

  moduleExams = (): Observable<ModuleExaminationRegulationAtom[]> =>
    this.http.getAll(this.resource, atomicParams)

  delete = (id: string): Observable<ModuleExaminationRegulation> =>
    this.http.delete(`${this.resource}/${id}`)

  create = (p: ModuleExaminationRegulationProtocol): Observable<ModuleExaminationRegulation> =>
    this.http.create(this.resource, p)
}
