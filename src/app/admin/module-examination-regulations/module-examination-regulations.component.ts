import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
import {ModuleExaminationRegulationProtocol, ModuleExaminationRegulationService} from './module-examination-regulation.service'
import {describeBoolean, describeExamReg, describeModule} from '../../utils/describe'
import {Create, Delete} from '../../generic-ui/crud-table/crud-table.component'
import {mapOpt} from '../../utils/optional'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {inspect} from '../../utils/inspect'

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
  create: [Create<ModuleExaminationRegulationProtocol>, CreateDialogData]

  constructor(private readonly service: ModuleExaminationRegulationService) {
    this.columns = [
      {attr: 'module', title: 'Modul'},
      {attr: 'examinationRegulation', title: 'Prüfungsordnung'},
      {attr: 'mandatory', title: 'Pflichtmodul'}
    ]
    this.data = service.moduleExams
    this.filterAttrs = this.columns.map(_ => _.title)
    this.delete = {
      labelForDialog: a => `${describeModule(a.module)} für ${describeExamReg(a.examinationRegulation)}`,
      delete: service.delete
    }
    this.create = [
      {
        create: attrs => mapOpt(service.parseProtocol(inspect(attrs)), service.create) ?? EMPTY,
        show: a => JSON.stringify(a)
      },
      {
        objectName: 'Modul mit Prüfungsordnung',
        inputs: service.createInputs()
      }
    ]
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
