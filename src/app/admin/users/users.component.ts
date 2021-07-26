import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {UsersService} from './users.service'
import {isLecturer, isUser, User} from '../../models/user'

@Component({
  selector: 'schd-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  headerTitle = 'Benutzer'
  tooltipTitle = 'Benutzer hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<User[]>
  filterAttrs: string[]

  constructor(private readonly service: UsersService) {
    this.columns = service.columns()
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.users
  }

  tableContent = (u: User, attr: string): string => {
    switch (attr) {
      case 'lastname':
        return u.lastname
      case 'firstname':
        return u.firstname
      case 'username':
        return u.username
      case 'email':
        return u.email
      case 'status':
        return isLecturer(u) ? 'Lehrkraft' : isUser(u) ? 'Benutzer' : '???' // TODO replace with status property
      default:
        return '???'
    }
  }
}
