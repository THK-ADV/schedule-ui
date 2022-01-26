import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MediaMatcher} from '@angular/cdk/layout'
import {describeUser, describeUserInitials} from '../../utils/describe'
import {LoginService} from '../../login/login.service'
import {Subscription} from 'rxjs'
import {MatSidenav} from '@angular/material/sidenav/sidenav'
import {User} from '../../models/user'

interface UserInfo {
  initials: string
  username: string
  name: string
  user: User
}

interface LinkItem {
  label: string
  icon: string,
  routerLink: string
}

const adminLinks = (): LinkItem[] => [
  {label: 'Studiengänge', icon: 'school', routerLink: 'studyPaths'},
  {label: 'Prüfungsordnungen', icon: 'approval', routerLink: 'examinationRegulations'},
  {label: 'Module in PO', icon: 'approval', routerLink: 'moduleExaminationRegulations'},
  {label: 'Module', icon: 'class', routerLink: 'modules'},
  {label: 'Submodule', icon: 'class', routerLink: 'submodules'},
  {label: 'Semester', icon: 'date_range', routerLink: 'semesters'},
  {label: 'Benutzer', icon: 'people', routerLink: 'users'},
]

const lecturerLinks = (): LinkItem[] => [
  {label: 'Module', icon: 'class', routerLink: 'modules'},
  {label: 'Stundenplanung', icon: 'schedule', routerLink: 'scheduling'},
]

@Component({
  selector: 'schd-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  userInfo?: UserInfo
  adminLinks?: LinkItem[]
  lecturerLinks?: LinkItem[]
  isAdmin = false

  @ViewChild('nav') nav!: MatSidenav

  readonly mobileQuery: MediaQueryList
  private readonly mobileQueryListener: () => void
  private readonly sub: Subscription

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
        this.lecturerLinks = lecturerLinks()
        this.isAdmin = true
      } else {
        this.userInfo = undefined
        this.adminLinks = undefined
        this.isAdmin = false
        this.nav.close()
      }
    })
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addListener(this.mobileQueryListener)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener)
    this.sub.unsubscribe()
  }

  logout = () =>
    this.loginService.logout()

  routerLink = (item: LinkItem, user: User) =>
    `lecturer/${user.id}/${item.routerLink}`
}
