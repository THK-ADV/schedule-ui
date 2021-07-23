import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {EMPTY, Observable, of, Subscription} from 'rxjs'
import {Sort} from '@angular/material/sort'
import {nestedObjectPropertyAccessor, TableHeaderColumn} from '../table/table.component'
import {MatDialog} from '@angular/material/dialog'
import {openDeleteDialog, openDialog} from '../dialog-opener'
import {AlertService} from '../../structure/alert/alert.service'
import {CreateDialogComponent, CreateDialogData} from '../create-dialog/create-dialog.component'

export interface Delete<A> {
  labelForDialog: (a: A) => string
  delete: (a: A) => Observable<A>
}

export interface Create<A0> {
  create: (attrs: { [attr: string]: string }) => Observable<A0>
  show: (a: A0) => string
}

export interface Update<A> {
  update: (a: A, attrs: { [attr: string]: string }) => Observable<A>
  show: (a: A) => string
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
  @Input() create?: [Create<A0>, CreateDialogData]
  @Input() update?: [Update<A>, (a: A) => CreateDialogData]

  data$: Observable<A[]> = EMPTY
  onDelete?: (a: A) => void
  onUpdate?: (a: A) => void
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
    if (this.update) {
      this.initOnUpdate(this.update)
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

  private initOnCreate = ([c, cdd]: [Create<A0>, CreateDialogData]) => {
    this.onCreate = () => {
      const s = openDialog(
        CreateDialogComponent.instance(this.dialog, cdd, 'create'),
        res => res === 'cancel' ? EMPTY : c.create(res)
      ).subscribe(created => {
        this.data$ = this.fetchData()
        this.reportCreated(c.show(created))
      })
      this.subs.push(s)
    }
  }

  private initOnUpdate = ([u, udd]: [Update<A>, (a: A) => CreateDialogData]) => {
    this.onUpdate = (a: A) => {
      const s = openDialog(
        CreateDialogComponent.instance(this.dialog, udd(a), 'update'),
        res => res === 'cancel' ? EMPTY : u.update(a, res)
      ).subscribe(updated => {
        this.data$ = this.fetchData()
        this.reportUpdated(u.show(updated))
      })
      this.subs.push(s)
    }
  }

  private reportDeleted = (str: string) =>
    this.alertService.reportSuccess(`deleted: ${str}`)

  private reportCreated = (str: string) =>
    this.alertService.reportSuccess(`created: ${str}`)

  private reportUpdated = (str: string) =>
    this.alertService.reportSuccess(`updated: ${str}`)
}
