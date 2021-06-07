import {Injectable} from '@angular/core'
import {atomicParams, HttpService} from './http.service'
import {Observable} from 'rxjs'
import {ModuleExaminationRegulationAtom} from '../models/module-examination-regulation'

@Injectable({
  providedIn: 'root'
})
export class ModuleExaminationRegulationApiService {

  constructor(private readonly http: HttpService) {
  }

  moduleExams = (): Observable<ModuleExaminationRegulationAtom[]> =>
    this.http.getAll('moduleExaminationRegulations', atomicParams)
}
