import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {mapOpt} from '../../utils/optional'
import {map} from 'rxjs/operators'
import {describeLanguage, describeModule, describeSeason} from '../../utils/describe'
import {SubmoduleAtom} from '../../models/submodule'
import {SubmoduleProtocol, SubmoduleService} from './submodule.service'

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
  create: [Create<SubmoduleProtocol>, CreateDialogData]
  update: [Update<SubmoduleAtom>, (e: SubmoduleAtom) => CreateDialogData]

  constructor(private readonly service: SubmoduleService) {
    this.columns = [
      {attr: 'label', title: 'Bezeichnung'},
      {attr: 'abbreviation', title: 'Abkürzung'},
      {attr: 'module', title: 'Modul'},
      {attr: 'recommendedSemester', title: 'Fachsemester'},
      {attr: 'credits', title: 'ECTS'},
      {attr: 'language', title: 'Sprache'},
      {attr: 'season', title: 'Angeboten in'}
    ]
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.submodules
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
        objectName: 'Teilmodul',
        inputs: service.createInputs()
      }
    ]
    this.update = [
      {
        update: (sm, attrs) =>
          mapOpt(
            service.createProtocol(sm, attrs),
            p => service.update(p, sm.id).pipe(map(a => ({...a, module: sm.module}))) // remove
          ) ?? EMPTY,
        show: a => JSON.stringify(a)
      },
      m => ({
        objectName: 'Teilmodul',
        inputs: service.updateInputs(m)
      })
    ]
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
