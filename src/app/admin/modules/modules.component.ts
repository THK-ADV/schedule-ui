import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {Module, ModuleAtom} from '../../models/module'
import {ModuleService} from './module.service'
import {isLecturer} from '../../models/user'
import {describeLecturer, describeUser} from '../../utils/describe'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'

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
  create: [Create<Module>, CreateDialogData]
  update: [Update<ModuleAtom, Module>, (e: ModuleAtom) => CreateDialogData]

  constructor(private readonly service: ModuleService) {
    this.columns = service.columns()
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.modules
    this.delete = service.deleteAction()
    this.create = service.createAction()
    this.update = service.updateAction()
  }

  tableContent = (module: ModuleAtom, attr: string): string => {
    switch (attr) {
      case 'label':
        return module.label
      case 'abbreviation':
        return module.abbreviation
      case 'courseManager':
        const user = module.courseManager
        return isLecturer(user) ? describeLecturer(user) : describeUser(user)
      case 'credits':
        return module.credits.toString()
      default:
        return '???'
    }
  }
}
