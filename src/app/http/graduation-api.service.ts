import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {nonAtomicParams} from './http-filter'
import {Graduation} from '../models/graduation'

@Injectable({
  providedIn: 'root'
})
export class GraduationApiService {

  private readonly resource = 'graduations'

  constructor(private readonly http: HttpService) {
  }

  graduations = (): Observable<Graduation[]> =>
    this.http.getAll(this.resource, nonAtomicParams)
}
