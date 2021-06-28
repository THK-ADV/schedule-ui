import {Component, EventEmitter, Input, Output} from '@angular/core'
import {EMPTY, Observable} from 'rxjs'
import {Sort} from '@angular/material/sort'
import {nestedObjectPropertyAccessor, TableHeaderColumn} from '../table/table.component'

@Component({
  selector: 'schd-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss']
})
export class CrudTableComponent<A> {

  @Input() headerTitle = 'header'
  @Input() tooltipTitle = 'tooltip'
  @Output() create = new EventEmitter<void>()
  @Input() columns: TableHeaderColumn[] = []
  @Input() pageSizeOptions = [25, 50, 100]
  @Input() useTableContentForFiltering = false
  @Input() sortingDataAccessor: (a: A, property: string) => any =
    nestedObjectPropertyAccessor
  @Input() tableContent: (a: A, attr: string) => string =
    nestedObjectPropertyAccessor
  @Input() edit?: (a: A) => void
  @Input() delete?: (a: A) => void
  @Input() select?: (a: A) => void
  @Input() data: Observable<A[]> = EMPTY
  @Input() sort?: Sort
  @Input() filterAttrs?: string[]
}
