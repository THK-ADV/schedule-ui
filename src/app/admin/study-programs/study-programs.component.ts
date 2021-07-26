import {Component} from '@angular/core'
import {StudyProgramProtocol, StudyProgramsService} from './study-programs.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../../models/study-program'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {TeachingUnitApiService} from '../../http/teaching-unit-api.service'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {TeachingUnit} from '../../models/teaching-unit'
import {Graduation} from '../../models/graduation'
import {GraduationApiService} from '../../http/graduation-api.service'
import {mapOpt, zip} from '../../utils/optional'
import {parseGraduation, parseTeachingUnit} from '../../utils/parser'

const parseProtocol = (attrs: { [p: string]: string }): StudyProgramProtocol | undefined =>
  mapOpt(
    zip(
      parseTeachingUnit(attrs.tu),
      parseGraduation(attrs.g)
    ),
    ([tu, g]) => ({
      label: attrs.label,
      abbreviation: attrs.abbrev,
      teachingUnit: tu.id,
      graduation: g.id
    })
  )

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
  update: [Update<StudyProgramAtom, StudyProgram>, (sp: StudyProgramAtom) => CreateDialogData]

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
      disabled: false,
      required: true,
      attr: 'tu',
      kind: 'auto-complete',
      data: tuService.teachingUnits(),
      show: a => a.label
    }
    const tuEditInput = (sp: StudyProgramAtom): AutoCompleteInput<TeachingUnit> => ({
      ...tuInput,
      disabled: true,
      initialValue: sps => sps.find(_ => _.id === sp.teachingUnit.id)
    })

    const gInput: AutoCompleteInput<Graduation> = {
      label: 'Abschluss',
      disabled: false,
      required: true,
      attr: 'g',
      kind: 'auto-complete',
      data: gService.graduations(),
      show: a => a.label
    }
    const gEditInput = (sp: StudyProgramAtom): AutoCompleteInput<Graduation> => ({
      ...gInput,
      disabled: true,
      initialValue: sps => sps.find(_ => _.id === sp.graduation.id)
    })

    this.create = [
      {
        create: attrs => mapOpt(parseProtocol(attrs), service.create) ?? EMPTY,
        show: a => a.label
      },
      {
        objectName: 'Studiengang',
        inputs: [
          {label: 'Bezeichnung', attr: 'label', kind: 'text', disabled: false, required: true},
          {label: 'Abkürzung', attr: 'abbrev', kind: 'text', disabled: false, required: true},
          tuInput,
          gInput
        ]
      }
    ]
    this.update = [
      {
        update: (a, attrs) => {
          const sp: StudyProgramProtocol = {
            label: attrs.label,
            abbreviation: attrs.abbrev,
            teachingUnit: a.teachingUnit.id,
            graduation: a.graduation.id
          }
          return service.update(sp, a.id)
        },
        show: a => `${a.label} (${a.abbreviation})`
      },
      sp => ({
        objectName: 'Studiengang',
        inputs: [
          {label: 'Bezeichnung', attr: 'label', kind: 'text', disabled: false, initialValue: sp.label, required: true},
          {label: 'Abkürzung', attr: 'abbrev', kind: 'text', disabled: false, initialValue: sp.abbreviation, required: true},
          tuEditInput(sp),
          gEditInput(sp)
        ]
      })
    ]
  }
}
