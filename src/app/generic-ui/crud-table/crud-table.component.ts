import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {EMPTY, Observable, of, Subscription} from 'rxjs'
import {Sort} from '@angular/material/sort'
import {nestedObjectPropertyAccessor, TableHeaderColumn} from '../table/table.component'
import {MatDialog} from '@angular/material/dialog'
import {openDeleteDialog} from '../dialog-opener'

export interface Delete<A> {
  labelForDialog: (a: A) => string
  delete: (a: A) => Observable<A>
}

@Component({
  selector: 'schd-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss']
})
export class CrudTableComponent<A> implements OnInit, OnDestroy {

  @Input() headerTitle = 'header'
  @Input() tooltipTitle = 'tooltip'
  @Input() columns: TableHeaderColumn[] = []
  @Input() pageSizeOptions = [25, 50, 100]
  @Input() useTableContentForFiltering = false
  @Input() sortingDataAccessor: (a: A, property: string) => any =
    nestedObjectPropertyAccessor
  @Input() tableContent: (a: A, attr: string) => string =
    nestedObjectPropertyAccessor
  @Input() sort?: Sort
  @Input() filterAttrs?: string[]
  @Input() delete?: Delete<A>

  data$: Observable<A[]> = EMPTY
  onDelete?: (a: A) => void
  private subs: Subscription[] = []

  @Input() fetchData: () => Observable<A[]> = () => of([])

  constructor(private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.data$ = this.fetchData()

    if (this.delete) {
      this.initOnDelete(this.delete)
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(_ => _.unsubscribe())
  }

  private initOnDelete = (d: Delete<A>) => {
    this.onDelete = (a) => {
      const s = openDeleteDialog(this.dialog, {label: d.labelForDialog(a)}, () => d.delete(a))
        .subscribe(deleted => {
          this.data$ = this.fetchData()
          console.log(deleted)
        })
      this.subs.push(s)
    }
  }
}
