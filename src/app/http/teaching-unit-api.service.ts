import {Injectable} from '@angular/core'
import {HttpService, nonAtomicParams} from './http.service'
import {Observable} from 'rxjs'
import {TeachingUnit} from '../models/teaching-unit'

@Injectable({
  providedIn: 'root'
})
export class TeachingUnitApiService {

  constructor(private readonly http: HttpService) {
  }

  teachingUnits = (): Observable<TeachingUnit[]> =>
    this.http.getAll('teachingUnits', nonAtomicParams)
}
