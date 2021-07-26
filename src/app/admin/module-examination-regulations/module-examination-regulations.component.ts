import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {ModuleExaminationRegulation, ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
import {ModuleExaminationRegulationService} from './module-examination-regulation.service'
import {describeBoolean, describeExamReg, describeModule} from '../../utils/describe'
import {Create, Delete} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'

@Component({
  selector: 'schd-module-examination-regulations',
  templateUrl: './module-examination-regulations.component.html',
  styleUrls: ['./module-examination-regulations.component.scss']
})
export class ModuleExaminationRegulationsComponent {

  headerTitle = 'Module und Prüfungsordnungen'
  tooltipTitle = 'Modul mit Prüfungsordnung hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<ModuleExaminationRegulationAtom[]>
  filterAttrs: string[]

  delete: Delete<ModuleExaminationRegulationAtom>
  create: [Create<ModuleExaminationRegulation>, CreateDialogData]

  constructor(private readonly service: ModuleExaminationRegulationService) {
    this.columns = service.columns()
    this.data = service.moduleExams
    this.filterAttrs = this.columns.map(_ => _.title)
    this.delete = service.deleteAction()
    this.create = service.createAction()
  }

  tableContent = (me: ModuleExaminationRegulationAtom, attr: string): string => {
    switch (attr) {
      case 'module':
        return describeModule(me.module)
      case 'examinationRegulation':
        return describeExamReg(me.examinationRegulation)
      case 'mandatory':
        return describeBoolean(me.mandatory)
      default:
        return '???'
    }
  }

}
