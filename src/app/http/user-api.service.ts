import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {Lecturer, User} from '../models/user'
import {nonAtomicParams} from './http-filter'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private readonly path = 'users'

  constructor(private readonly http: HttpService) {
  }

  lecturer = (): Observable<Lecturer[]> => {
    const params = nonAtomicParams.set('status', 'lecturer')
    return this.http.getAll(this.path, params)
  }

  users = (): Observable<User[]> => {
    return this.http.getAll(this.path, nonAtomicParams)
  }

  currentUser = (username: string): Observable<User | undefined> =>
    this.http.getAll<User>(`users?username=${username}`, nonAtomicParams)
      .pipe(map(xs => xs.shift()))
}
