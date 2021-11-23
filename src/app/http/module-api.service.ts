import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {Module, ModuleAtom} from '../models/module'
import {atomicParams, nonAtomicParams} from './http-filter'
import {ModuleProtocol} from '../admin/modules/module.service'

@Injectable({
  providedIn: 'root'
})
export class ModuleApiService {

  private readonly resource = 'modules'

  constructor(private readonly http: HttpService) {
  }

  modulesAtomic = (): Observable<ModuleAtom[]> =>
    this.http.getAll(this.resource, atomicParams)

  modules = (): Observable<Module[]> =>
    this.http.getAll(this.resource, nonAtomicParams)

  delete = (id: string): Observable<Module> =>
    this.http.delete(`${this.resource}/${id}`)

  create = (p: ModuleProtocol): Observable<Module> =>
    this.http.create(this.resource, p)

  update = (p: ModuleProtocol, id: string): Observable<Module> =>
    this.http.put(`${this.resource}/${id}`, p)
}
