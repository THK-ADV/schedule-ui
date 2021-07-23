import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {Module, ModuleAtom} from '../models/module'
import {atomicParams, nonAtomicParams} from './http-filter'

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
}
