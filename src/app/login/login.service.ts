import {Injectable} from '@angular/core'
import {Observable, Subject} from 'rxjs'
import {KeycloakService} from 'keycloak-angular'
import {UserApiService} from '../http/user-api.service'
import {User} from '../models/user'
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user = new Subject<User>()
  user$: Observable<User>

  constructor(
    private readonly keycloak: KeycloakService,
    private readonly userApiService: UserApiService,
    private readonly router: Router
  ) {
    this.user$ = this.user.asObservable()
  }

  loadUser = async () =>
    this.keycloak.isLoggedIn()
      .then(b => b ? this.keycloak.loadUserProfile() : undefined)
      .then(p => p && p.username ? this.userApiService.currentUser(p.username).toPromise() : undefined)
      .then(u => this.user.next(u))

  logout = async () =>
    this.router.navigateByUrl('')
      .then(_ => this.keycloak.logout())
      .then(_ => this.user.next(undefined))

  login = async () =>
    this.keycloak.login()
}
