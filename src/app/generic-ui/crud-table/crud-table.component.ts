import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {EMPTY, Observable, of, Subscription} from 'rxjs'
import {Sort} from '@angular/material/sort'
import {nestedObjectPropertyAccessor, TableHeaderColumn} from '../table/table.component'
import {MatDialog} from '@angular/material/dialog'
import {openDeleteDialog, openDialog} from '../dialog-opener'
import {AlertService} from '../../structure/alert/alert.service'
import {CreateDialogComponent} from '../create-dialog/create-dialog.component'

export interface Delete<A> {
  labelForDialog: (a: A) => string
  delete: (a: A) => Observable<A>
}

export interface Create<A0, A> {
  create: (a0: A0) => Observable<A>
}

@Component({
  selector: 'schd-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.scss']
})
export class CrudTableComponent<A0, A> implements OnInit, OnDestroy {

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
  @Input() create?: Create<A0, A>

  data$: Observable<A[]> = EMPTY
  onDelete?: (a: A) => void
  onCreate?: () => void

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
    if (this.create) {
      this.initOnCreate(this.create)
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

  private initOnCreate = (c: Create<A0, A>) => {
    this.onCreate = () => {
      const objectName = 'Studiengang'
      const s = openDialog(
        CreateDialogComponent.instance(this.dialog, {
          objectName,
          inputs: [
            {label: 'Bezeichnung', attr: 'label', kind: 'text'},
            {label: 'Abkürzung', attr: 'abbrev', kind: 'text'},
            {label: 'Prüfungsordnung', attr: 'po', kind: 'number', min: 1},
          ]
        }),
        res => res === 'cancel' ? EMPTY : of(res)
      ).subscribe(console.log)
      this.subs.push(s)
    }
  }

  private reportDeleted = (str: string) =>
    this.alertService.reportSuccess(`deleted: ${str}`)
}
