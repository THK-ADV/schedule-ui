import {Component, OnDestroy} from '@angular/core'
import {LoginService} from '../login.service'
import {User} from '../../models/user'
import {Subscription} from 'rxjs'

@Component({
  selector: 'schd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  loggedInUser?: User
  sub: Subscription

  constructor(
    private readonly service: LoginService
  ) {
    this.sub = service.user$()
      .subscribe(u => this.loggedInUser = u)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  login = () =>
    this.loggedInUser
      ? this.service.logout()
      : this.service.login()
}
