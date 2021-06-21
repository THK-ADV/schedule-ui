import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'

interface AdminMenu {
  label: string
  icon: string,
  routerLink: string
}

const adminMenus = (): AdminMenu[] => [
  {label: 'Studiengänge', icon: 'school', routerLink: 'studyPaths'}
]

@Component({
  selector: 'schd-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  menus: AdminMenu[] = adminMenus()

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  openMenu = (menu: AdminMenu) =>
    this.router.navigate([menu.routerLink])
}
