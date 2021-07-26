import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {Semester} from '../../models/semester'
import {SemestersService} from './semesters.service'
import {formatDate} from '../../utils/date-format'

@Component({
  selector: 'schd-semesters',
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.scss']
})
export class SemestersComponent {

  headerTitle = 'Semester'
  tooltipTitle = 'Semester hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<Semester[]>
  filterAttrs: string[]

  delete: Delete<Semester>
  create: [Create<Semester>, CreateDialogData]
  update: [Update<Semester, Semester>, (e: Semester) => CreateDialogData]

  constructor(private readonly service: SemestersService) {
    this.columns = service.columns()
    this.data = service.semesters
    this.filterAttrs = this.columns.map(_ => _.title)
    this.delete = service.deleteAction()
    this.create = service.createAction()
    this.update = service.updateAction()
  }

  tableContent = (s: Semester, attr: string): string => {
    switch (attr) {
      case 'label':
        return s.label
      case 'abbreviation':
        return s.abbreviation
      case 'start':
        return formatDate(s.start, 'dd.MM.yyyy')
      case 'end':
        return formatDate(s.end, 'dd.MM.yyyy')
      case 'lectureStart':
        return formatDate(s.lectureStart, 'dd.MM.yyyy')
      case 'lectureEnd':
        return formatDate(s.lectureEnd, 'dd.MM.yyyy')
      default:
        return '???'
    }
  }

  sortingDataAccessor = (s: Semester, attr: string): any => {
    switch (attr) {
      case 'start':
        return new Date(s.start)
      case 'end':
        return new Date(s.end)
      case 'lectureStart':
        return new Date(s.lectureStart)
      case 'lectureEnd':
        return new Date(s.lectureEnd)
      default:
        return this.tableContent(s, attr)
    }
  }
}
