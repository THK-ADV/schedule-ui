import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {Lecturer} from '../models/user'
import {nonAtomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private readonly http: HttpService) {
  }

  lecturer = (): Observable<Lecturer[]> => {
    const params = nonAtomicParams.set('status', 'lecturer')
    return this.http.getAll('users', params)
  }

}
