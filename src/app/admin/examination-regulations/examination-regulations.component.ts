import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {ExaminationRegulation, ExaminationRegulationAtom} from '../../models/examination-regulation'
import {ExaminationRegulationsService} from './examination-regulations.service'
import {formatDate} from '../../utils/date-format'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {describeStudyProgramAtom} from '../../utils/describe'


@Component({
  selector: 'schd-examination-regulations',
  templateUrl: './examination-regulations.component.html',
  styleUrls: ['./examination-regulations.component.scss']
})
export class ExaminationRegulationsComponent {

  headerTitle = 'Prüfungsordnungen'
  tooltipTitle = 'Prüfungsordnung hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<ExaminationRegulationAtom[]>
  filterAttrs: string[]

  delete: Delete<ExaminationRegulationAtom>
  create: [Create<ExaminationRegulation>, CreateDialogData]
  update: [Update<ExaminationRegulationAtom, ExaminationRegulation>, (e: ExaminationRegulationAtom) => CreateDialogData]

  constructor(
    private readonly service: ExaminationRegulationsService
  ) {
    this.columns = service.columns()
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.examinationRegulations
    this.delete = service.deleteAction()
    this.create = service.createAction()
    this.update = service.updateAction()
  }

  tableContent = (exam: ExaminationRegulationAtom, attr: string): string => {
    switch (attr) {
      case 'studyProgram':
        return describeStudyProgramAtom(exam.studyProgram)
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
