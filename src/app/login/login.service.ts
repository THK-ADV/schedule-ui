import {Injectable} from '@angular/core'
import {User} from '../models/user'
import {Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user = new Subject<User>()

  user$ = () =>
    this.user.asObservable()

  login = () =>
    this.user.next({
      firstname: 'Alexander',
      lastname: 'Dobrynin',
      username: 'adobryni',
      email: 'alexander.dobrynin@th-koeln.de',
      id: 'random-uuid'
    })

  logout = () =>
    this.user.next(undefined)
}
