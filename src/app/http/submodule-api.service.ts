import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {atomicParams} from './http-filter'
import {SubmoduleAtom} from '../models/submodule'

@Injectable({
  providedIn: 'root'
})
export class SubmoduleApiService {

  private readonly resource = 'subModules'

  constructor(private readonly http: HttpService) {
  }

  submodules = (): Observable<SubmoduleAtom[]> =>
    this.http.getAll(this.resource, atomicParams)
}
