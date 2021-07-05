import {Component} from '@angular/core'
import {StudyProgramProtocol, StudyProgramsService} from './study-programs.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {StudyProgramAtom} from '../../models/study-program'
import {Create, Delete} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {TeachingUnitApiService} from '../../http/teaching-unit-api.service'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {isTeachingUnit, TeachingUnit} from '../../models/teaching-unit'
import {Graduation, isGraduation} from '../../models/graduation'
import {GraduationApiService} from '../../http/graduation-api.service'

@Component({
  selector: 'schd-study-programs',
  templateUrl: './study-programs.component.html',
  styleUrls: ['./study-programs.component.scss']
})
export class StudyProgramsComponent {

  headerTitle = 'Studiengänge'
  tooltipTitle = 'Studiengang hinzufügen'
  columns: TableHeaderColumn[]
  data: () => Observable<StudyProgramAtom[]>
  delete: Delete<StudyProgramAtom>
  create: [Create<StudyProgramProtocol>, CreateDialogData]

  constructor(
    private readonly service: StudyProgramsService,
    private readonly tuService: TeachingUnitApiService,
    private readonly gService: GraduationApiService,
  ) {
    this.columns = [
      {attr: 'label', title: 'Bezeichnung'},
      {attr: 'abbreviation', title: 'Abkürzung'},
      {attr: 'teachingUnit.label', title: 'Lehreinheit'},
      {attr: 'graduation.abbreviation', title: 'Abschluss'},
    ]
    this.data = service.studyPrograms
    this.delete = {
      labelForDialog: (sp) => sp.label,
      delete: service.delete
    }
    const tuInput: AutoCompleteInput<TeachingUnit> = {
      label: 'Lehreinheit',
      attr: 'tu',
      kind: 'auto-complete',
      data: tuService.teachingUnits(),
      show: a => a.label
    }
    const gInput: AutoCompleteInput<Graduation> = {
      label: 'Abschluss',
      attr: 'g',
      kind: 'auto-complete',
      data: gService.graduations(),
      show: a => a.label
    }
    this.create = [
      {
        create: (attrs) => {
          if (!isTeachingUnit(attrs.tu) || !isGraduation(attrs.g)) {
            return EMPTY
          }
          return service.create({
            label: attrs.label,
            abbreviation: attrs.abbrev,
            teachingUnit: attrs.tu.id,
            graduation: attrs.g.id
          })
        },
        show: a => a.label
      },
      {
        objectName: 'Studiengang',
        inputs: [
          {label: 'Bezeichnung', attr: 'label', kind: 'text'},
          {label: 'Abkürzung', attr: 'abbrev', kind: 'text'},
          tuInput,
          gInput
        ]
      }
    ]
  }
}
