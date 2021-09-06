import {Component, OnDestroy} from '@angular/core'
import {EMPTY, of, Subscription} from 'rxjs'
import {LecturerModule, LecturerModuleService} from '../admin/examination-regulations/lecturer-module.service'
import {ActivatedRoute} from '@angular/router'
import {switchMap} from 'rxjs/operators'
import {TableHeaderColumn} from '../generic-ui/table/table.component'
import {MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'schd-lecturer-modules',
  templateUrl: './lecturer-modules.component.html',
  styleUrls: ['./lecturer-modules.component.scss']
})
export class LecturerModulesComponent implements OnDestroy {

  headerTitle = 'Meine Module'
  tooltipTitle = 'WPF hinzufügen'
  dataSource: MatTableDataSource<LecturerModule>
  columns: TableHeaderColumn[]
  displayedColumns: string[]
  sub: Subscription
  filterAttrs: string[] // TODO unused
  create: () => void

  constructor(
    readonly lecturerModuleService: LecturerModuleService,
    private readonly route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource()
    this.columns = lecturerModuleService.columns()
    this.displayedColumns = this.columns.map(_ => _.attr)
    this.filterAttrs = this.columns.map(_ => _.title)
    this.create = lecturerModuleService.createWPF
    this.sub = route.paramMap.pipe(
      switchMap(map => {
        const id = map.get('id')
        return id ? of(id) : EMPTY
      }),
      switchMap(id => lecturerModuleService.lecturerModules(id))
    ).subscribe(xs => {
      this.dataSource.data = xs ?? []
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
