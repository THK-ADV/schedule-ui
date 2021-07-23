import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {ModuleAtom} from '../../models/module'
import {ModuleProtocol, ModuleService} from './module.service'
import {isLecturer} from '../../models/user'
import {describeLecturer, describeUser} from '../../utils/describe'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {mapOpt} from '../../utils/optional'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {map} from 'rxjs/operators'
import {tap} from '../../utils/tap'

@Component({
  selector: 'schd-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent {

  headerTitle = 'Module'
  tooltipTitle = 'Modul hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<ModuleAtom[]>
  filterAttrs: string[]

  delete: Delete<ModuleAtom>
  create: [Create<ModuleProtocol>, CreateDialogData]
  update: [Update<ModuleAtom>, (e: ModuleAtom) => CreateDialogData]

  constructor(private readonly service: ModuleService) {
    this.columns = [
      {attr: 'label', title: 'Bezeichnung'},
      {attr: 'abbreviation', title: 'Abkürzung'},
      {attr: 'courseManager', title: 'Modulverantwortlicher'},
      {attr: 'credits', title: 'ECTS'},
    ]
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.modules
    this.delete = {
      labelForDialog: a => a.label,
      delete: service.delete
    }
    this.create = [
      {
        create: attrs => mapOpt(service.parseProtocol(attrs), service.create) ?? EMPTY,
        show: a => JSON.stringify(a)
      },
      {
        objectName: 'Module',
        inputs: service.createInputs()
      }
    ]
    this.update = [
      {
        update: (m, attrs) =>
          mapOpt(
            tap(service.createProtocol(m, attrs)),
            p => service.update(p, m.id).pipe(map(a => ({...a, courseManager: m.courseManager}))) // remove
          ) ?? EMPTY
        ,
        show: a => `${a.label} (${a.abbreviation})`
      },
      m => ({
        objectName: 'Module',
        inputs: service.updateInputs(m)
      })
    ]
  }

  tableContent = (exam: ModuleAtom, attr: string): string => {
    switch (attr) {
      case 'label':
        return exam.label
      case 'abbreviation':
        return exam.abbreviation
      case 'courseManager':
        const user = exam.courseManager
        return isLecturer(user) ? describeLecturer(user) : describeUser(user)
      case 'credits':
        return exam.credits.toString()
      default:
        return '???'
    }
  }
}
