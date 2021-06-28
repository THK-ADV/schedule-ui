import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'schd-header-button',
  templateUrl: './header-button.component.html',
  styleUrls: ['./header-button.component.scss']
})
export class HeaderButtonComponent {

  @Input() headerTitle = 'Header'
  @Input() tooltipTitle = 'Tooltip'
  @Output() create = new EventEmitter()
}
