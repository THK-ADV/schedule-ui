import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {ModuleAtom} from '../models/module'
import {atomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class ModuleApiService {

  private readonly resource = 'modules'

  constructor(private readonly http: HttpService) {
  }

  modules = (): Observable<ModuleAtom[]> =>
    this.http.getAll(this.resource, atomicParams)
}
