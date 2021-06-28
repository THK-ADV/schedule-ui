import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {ExaminationRegulationsService} from './examination-regulations.service'
import {formatDate} from '../../utils/date-format'

@Component({
  selector: 'schd-examination-regulations',
  templateUrl: './examination-regulations.component.html',
  styleUrls: ['./examination-regulations.component.scss']
})
export class ExaminationRegulationsComponent {

  headerTitle = 'Prüfungsordnungen'
  tooltipTitle = 'Prüfungsordnung hinzufügen'

  columns: TableHeaderColumn[]
  data: Observable<ExaminationRegulationAtom[]>
  filterAttrs: string[]

  constructor(private readonly service: ExaminationRegulationsService) {
    this.columns = [
      {attr: 'studyProgram', title: 'Studiengang'},
      {attr: 'number', title: 'PO Nummer'},
      {attr: 'start', title: 'Start'},
      {attr: 'end', title: 'Ende'},
    ]
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.examinationRegulations()
  }

  delete = (sp: ExaminationRegulationAtom) =>
    console.log('delete', sp)

  edit = (sp: ExaminationRegulationAtom) =>
    console.log('edit', sp)

  select = (sp: ExaminationRegulationAtom) =>
    console.log('select', sp)

  create = () =>
    console.log('create')

  tableContent = (exam: ExaminationRegulationAtom, attr: string): string => {
    switch (attr) {
      case 'studyProgram':
        const sp = exam.studyProgram
        return `${sp.label} (${sp.abbreviation} ${sp.graduation.abbreviation})`
      case 'number':
        return exam.number.toString()
      case 'start':
        return formatDate(exam.start, 'dd.MM.yyyy')
      case 'end':
        return exam.end ? formatDate(exam.end, 'dd.MM.yyyy') : '-'
      default:
        return '???'
    }
  }

  sortingDataAccessor = (exam: ExaminationRegulationAtom, attr: string): any => {
    switch (attr) {
      case 'start':
        return new Date(exam.start)
      case 'end':
        return exam.end ? new Date(exam.end) : '-'
      default:
        return this.tableContent(exam, attr)
    }
  }

}
