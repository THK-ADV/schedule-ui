import {Component, OnDestroy, OnInit} from '@angular/core'
import {Subscription} from 'rxjs'
import {delay} from 'rxjs/operators'
import {Alert, AlertService} from './alert.service'

@Component({
  selector: 'schd-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  private readonly delay = 5000
  private subs: Subscription[] = []
  alerts: Alert[] = []

  constructor(private alertService: AlertService) {
  }

  close = (alert: Alert) =>
    this.alerts.splice(this.alerts.indexOf(alert), 1)

  ngOnInit(): void {
    const alerts = this.alertService.alerts$()

    this.subs.push(
      alerts.subscribe(a => this.alerts.push(a))
    )

    this.subs.push(
      alerts.pipe(delay(this.delay))
        .subscribe(a => this.close(a))
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach(_ => _.unsubscribe())
  }
}
