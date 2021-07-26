import {Injectable} from '@angular/core'
import {UserApiService} from '../../http/user-api.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {TextInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {Observable} from 'rxjs'
import {User} from '../../models/user'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  readonly lastname: TextInput
  readonly firstname: TextInput
  readonly username: TextInput
  readonly email: TextInput
  readonly status: TextInput

  constructor(private readonly http: UserApiService) {
    this.lastname = {
      label: 'Nachname',
      attr: 'lastname',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.firstname = {
      label: 'Vorname',
      attr: 'firstname',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.username = {
      label: 'Benutzername',
      attr: 'username',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.email = {
      label: 'Email',
      attr: 'email',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.status = {
      label: 'Status',
      attr: 'status',
      disabled: false,
      required: true,
      kind: 'text'
    }
  }

  columns = (): TableHeaderColumn[] => [
    {attr: 'lastname', title: 'Nachname'},
    {attr: 'firstname', title: 'Vorname'},
    {attr: 'username', title: 'Benutzername'},
    {attr: 'email', title: 'Email'},
    {attr: 'status', title: 'Status'},
  ]

  users = (): Observable<User[]> =>
    this.http.users()
}
