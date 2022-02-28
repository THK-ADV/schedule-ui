import {ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core'
import {MediaMatcher} from '@angular/cdk/layout'
import {describeUser, describeUserInitials} from '../../utils/describe'
import {LoginService} from '../../login/login.service'
import {Subscription} from 'rxjs'
import {MatSidenav} from '@angular/material/sidenav/sidenav'
import {User} from '../../models/user'
import {LinkItem} from './link-item'
import adminLinks = LinkItem.adminLinks
import lectureLinks = LinkItem.lecturerLinks

interface UserInfo {
  initials: string
  username: string
  name: string
  user: User
}

@Component({
  selector: 'schd-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {

  userInfo?: UserInfo
  adminLinks?: LinkItem[]
  lecturerLinks?: LinkItem[]
  isAdmin = false

  @ViewChild('nav') nav?: MatSidenav

  readonly mobileQuery: MediaQueryList
  private readonly mobileQueryListener: () => void
  private sub?: Subscription

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly media: MediaMatcher,
    private readonly loginService: LoginService
  ) {
    this.sub = this.loginService.user$.subscribe(user => {
      if (user !== undefined) {
        this.userInfo = {
          username: `@${user.username}`,
          name: describeUser(user),
          initials: describeUserInitials(user),
          user
        }
        this.adminLinks = adminLinks()
        this.lecturerLinks = lectureLinks()
        this.isAdmin = true
      } else {
        this.userInfo = undefined
        this.adminLinks = undefined
        this.isAdmin = false
        this.nav?.close()
      }
    })
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this.mobileQueryListener)
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener)
    this.sub?.unsubscribe()
  }

  logout = () =>
    this.loginService.logout()

  onHamburgerMenuClick = () =>
    this.nav?.toggle()
}
