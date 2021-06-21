import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MatSort, Sort} from '@angular/material/sort'
import {MatPaginator} from '@angular/material/paginator'
import {EMPTY, Observable, Subscription} from 'rxjs'
import {MatTableDataSource} from '@angular/material/table'

export interface TableHeaderColumn {
  attr: string
  title: string
}

export const nestedObjectPropertyAccessor = <A>(obj: A, prop: string): any =>
  prop.split('.').reduce(
    (o, p) => {
      // @ts-ignore
      return o && o[p]
    },
    obj
  )


@Component({
  selector: 'schd-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<A> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, {static: true})
  private matSort?: MatSort

  @ViewChild(MatPaginator, {static: true})
  private paginator?: MatPaginator

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

  filterHint = 'Filter'

  private sub?: Subscription

  dataSource = new MatTableDataSource<A>()
  displayedColumns: string[] = []

  constructor() {
  }

  ngOnInit(): void {
    this.initDisplayedColumns()
    this.initDataSource()
    this.initFilterHints()
    this.updateDataSourceWithData()
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator
    }

    if (this.matSort) {
      this.dataSource.sort = this.matSort
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  private updateDataSourceWithData = () => {
    this.sub = this.data.subscribe(data => {
      if (data) {
        this.dataSource.data = data
        this.triggerSort()
      } else {
        this.dataSource.data = []
      }
    })
  }

  private initDisplayedColumns = () => {
    this.displayedColumns = this.columns.map(_ => _.attr)
    if (this.edit || this.delete) {
      this.displayedColumns.push('action')
    }
  }

  private initDataSource = () => {
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor
    if (this.useTableContentForFiltering) {
      this.dataSource.filterPredicate = (obj, filter) =>
        Object.keys(obj).some(k => this.tableContent(obj, k).toLowerCase().includes(filter))
    }
  }

  private initFilterHints = () => {
    const filterAttrs = this.filterAttrs ?? this.columns
      .filter(a => !a.attr.includes('.'))
      .map(a => a.title)

    const activeFilter = filterAttrs.join(', ')

    if (activeFilter) {
      this.filterHint = `Filtern nach: ${activeFilter}`
    }
  }

  private triggerSort = () => {
    if (this.sort && this.matSort) {
      this.matSort.active = this.sort.active
      this.matSort.direction = this.sort.direction
      this.matSort.sortChange.emit(this.sort)
    }
  }

  onSelect = (a: A) =>
    this.select && this.select(a)

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
