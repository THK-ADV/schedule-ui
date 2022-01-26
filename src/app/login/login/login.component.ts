import {Component, OnDestroy, OnInit} from '@angular/core'
import {LoginService} from '../login.service'
import {Subscription} from 'rxjs'
import {User} from '../../models/user'

@Component({
  selector: 'schd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  title = 'Login'
  loggedInUser?: User
  sub?: Subscription

  constructor(
    private readonly service: LoginService
  ) {
    this.sub = service.user$
      .subscribe(u => {
        this.loggedInUser = u
        this.title = this.loggedInUser ? 'Logout' : 'Login'
      })
  }

  async ngOnInit(): Promise<void> {
    await this.service.loadUser()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  login = () =>
    !this.loggedInUser
      ? this.service.login()
      : this.service.logout()
}
