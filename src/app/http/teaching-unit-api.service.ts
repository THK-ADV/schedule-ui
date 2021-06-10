import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {TeachingUnit} from '../models/teaching-unit'
import {nonAtomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class TeachingUnitApiService {

  constructor(private readonly http: HttpService) {
  }

  teachingUnits = (): Observable<TeachingUnit[]> =>
    this.http.getAll('teachingUnits', nonAtomicParams)
}
