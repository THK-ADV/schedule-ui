import {Component, Input} from '@angular/core'

@Component({
  selector: 'schd-header-button',
  templateUrl: './header-button.component.html',
  styleUrls: ['./header-button.component.scss']
})
export class HeaderButtonComponent {

  @Input() headerTitle = 'Header'
  @Input() tooltipTitle = 'Tooltip'
  @Input() create?: () => void

  onCreate = () =>
    this.create && this.create()
}
