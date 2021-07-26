import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'

interface AdminMenu {
  label: string
  icon: string,
  routerLink: string
}

const adminMenus = (): AdminMenu[] => [
  {label: 'Studiengänge', icon: 'school', routerLink: 'studyPaths'},
  {label: 'Prüfungsordnungen', icon: 'approval', routerLink: 'examinationRegulations'},
  {label: 'Module in PO', icon: 'approval', routerLink: 'moduleExaminationRegulations'},
  {label: 'Module', icon: 'class', routerLink: 'modules'},
  {label: 'Submodule', icon: 'class', routerLink: 'submodules'},
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
