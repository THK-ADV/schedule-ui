import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {EMPTY, Observable, of, Subscription} from 'rxjs'
import {Sort} from '@angular/material/sort'
import {nestedObjectPropertyAccessor, TableHeaderColumn} from '../table/table.component'
import {MatDialog} from '@angular/material/dialog'
import {openDeleteDialog} from '../dialog-opener'
import {AlertService} from '../../structure/alert/alert.service'

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

  constructor(
    private readonly dialog: MatDialog,
    private readonly alertService: AlertService
  ) {
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
      const label = d.labelForDialog(a)
      const s = openDeleteDialog(this.dialog, {label}, () => d.delete(a))
        .subscribe(_ => {
          this.data$ = this.fetchData()
          this.reportDeleted(label)
        })
      this.subs.push(s)
    }
  }

  private reportDeleted = (str: string) =>
    this.alertService.reportSuccess(`deleted: ${str}`)
}
