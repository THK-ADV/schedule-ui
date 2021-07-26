import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {describeLanguage, describeModule, describeSeason} from '../../utils/describe'
import {Submodule, SubmoduleAtom} from '../../models/submodule'
import {SubmoduleService} from './submodule.service'

@Component({
  selector: 'schd-submodule',
  templateUrl: './submodule.component.html',
  styleUrls: ['./submodule.component.scss']
})
export class SubmoduleComponent {

  headerTitle = 'Teilmodule'
  tooltipTitle = 'Teilmodul hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<SubmoduleAtom[]>
  filterAttrs: string[]

  delete: Delete<SubmoduleAtom>
  create: [Create<Submodule>, CreateDialogData]
  update: [Update<SubmoduleAtom, Submodule>, (e: SubmoduleAtom) => CreateDialogData]

  constructor(private readonly service: SubmoduleService) {
    this.columns = service.columns()
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.submodules
    this.delete = service.deleteAction()
    this.create = service.createAction()
    this.update = service.updateAction()
  }

  tableContent = (sm: SubmoduleAtom, attr: string): string => {
    switch (attr) {
      case 'label':
        return sm.label
      case 'abbreviation':
        return sm.abbreviation
      case 'module':
        return describeModule(sm.module)
      case 'recommendedSemester':
        return sm.recommendedSemester.toString()
      case 'credits':
        return sm.credits.toString()
      case 'language':
        return describeLanguage(sm.language)
      case 'season':
        return describeSeason(sm.season)
      default:
        return '???'
    }
  }
}
