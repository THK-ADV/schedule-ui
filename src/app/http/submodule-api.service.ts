import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {SubmoduleAtom} from '../models/submodule'
import {applyFilter, atomicParams, Filter} from './http-filter'
import {HttpService} from './http.service'

export interface SubmoduleFilter extends Filter {
  key: 'lecturer'
}

@Injectable({
  providedIn: 'root'
})
export class SubmoduleApiService {

  private readonly resource = 'subModules'

  constructor(private readonly http: HttpService) {
  }

  submodules = (filter?: SubmoduleFilter[]): Observable<SubmoduleAtom[]> =>
    this.http.getAll(this.resource, applyFilter(atomicParams, filter))
}
