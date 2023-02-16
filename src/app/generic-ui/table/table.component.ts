import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MatSort, Sort} from '@angular/material/sort'
import {MatLegacyPaginator as MatPaginator} from '@angular/material/legacy-paginator'
import {Observable, Subscription} from 'rxjs'
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table'
import {asRecord} from '../../utils/record-ops'

export interface TableHeaderColumn {
  attr: string
  title: string
}

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

  @Input() columns!: TableHeaderColumn[]
  @Input() pageSizeOptions!: number[]
  @Input() useTableContentForFiltering!: boolean
  @Input() sortingDataAccessor!: (a: A, property: string) => string | number
  @Input() tableContent!: (a: A, attr: string) => string
  @Input() edit?: (a: A) => void
  @Input() delete?: (a: A) => void
  @Input() select?: (a: A) => void
  @Input() sort?: Sort
  @Input() filterAttrs?: string[]

  @Input() set data(data$: Observable<A[]>) {
    this.updateDataSourceWithData(data$)
  }

  filterHint = 'Filter'

  private sub?: Subscription

  dataSource = new MatTableDataSource<A>()
  displayedColumns: string[] = []

  ngOnInit(): void {
    this.initDisplayedColumns()
    this.initDataSource()
    this.initFilterHints()
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

  private updateDataSourceWithData = (data$: Observable<A[]>) => {
    this.sub = data$.subscribe(data => {
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
      this.dataSource.filterPredicate = this.filterPredicate
    }
  }

  private filterPredicate = (data: A, filter: string): boolean => {
    const record = asRecord(data)
    if (!record) {
      return false
    }
    return Object.keys(record).some(k => this.tableContent(data, k).toLowerCase().includes(filter))
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
