import {Injectable} from '@angular/core'
import {Subject} from 'rxjs'

type AlertType =
  'success' |
  'info' |
  'warning' |
  'danger' |
  'primary' |
  'secondary' |
  'light' |
  'dark'

interface Message {
  kind: 'message'
  value: string
}

type AlertBody = Message

export interface Alert {
  type: AlertType
  body: AlertBody
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alerts = new Subject<Alert>()

  constructor() {
  }

  alerts$ = () =>
    this.alerts.asObservable()

  reportAlert = (alert: Alert) =>
    this.alerts.next(alert)

  reportSuccess = (message: string) =>
    this.reportAlert({type: 'success', body: {kind: 'message', value: message}})

  reportError = (error: Error) =>
    this.reportAlert({type: 'danger', body: {kind: 'message', value: error.message}})
}
