import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'schd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loggedIn = false

  constructor() {
  }

  ngOnInit(): void {
  }

  login = () => {
    this.loggedIn = true
  }

}
