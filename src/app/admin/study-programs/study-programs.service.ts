import {Injectable} from '@angular/core'
import {StudyProgramApiService} from '../../http/study-program-api.service'
import {EMPTY, Observable} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../../models/study-program'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {TeachingUnit} from '../../models/teaching-unit'
import {TeachingUnitApiService} from '../../http/teaching-unit-api.service'
import {Graduation} from '../../models/graduation'
import {GraduationApiService} from '../../http/graduation-api.service'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {mapOpt, zip} from '../../utils/optional'
import {parseGraduation, parseTeachingUnit} from '../../utils/parser'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {TextInput} from '../../generic-ui/create-dialog/input-text/input-text.component'

export interface StudyProgramProtocol {
  label: string
  abbreviation: string
  teachingUnit: string
  graduation: string
}

@Injectable({
  providedIn: 'root'
})
export class StudyProgramsService {

  private readonly label: TextInput
  private readonly abbreviation: TextInput
  private readonly teachingUnit: AutoCompleteInput<TeachingUnit>
  private readonly graduation: AutoCompleteInput<Graduation>

  constructor(
    private readonly http: StudyProgramApiService,
    private readonly tuService: TeachingUnitApiService,
    private readonly gService: GraduationApiService,
  ) {
    this.label = {
      label: 'Bezeichnung',
      attr: 'label',
      kind: 'text',
      disabled: false,
      required: true
    }
    this.abbreviation = {
      label: 'Abkürzung',
      attr: 'abbreviation',
      kind: 'text',
      disabled: false,
      required: true
    }
    this.teachingUnit = {
      label: 'Lehreinheit',
      attr: 'teachingUnit',
      disabled: false,
      required: true,
      kind: 'auto-complete',
      data: tuService.teachingUnits(),
      show: a => a.label
    }
    this.graduation = {
      label: 'Abschluss',
      attr: 'graduation',
      disabled: false,
      required: true,
      kind: 'auto-complete',
      data: gService.graduations(),
      show: a => a.label
    }
  }

  columns = (): TableHeaderColumn[] => [
    {attr: 'label', title: 'Bezeichnung'},
    {attr: 'abbreviation', title: 'Abkürzung'},
    {attr: 'teachingUnit.label', title: 'Lehreinheit'},
    {attr: 'graduation.abbreviation', title: 'Abschluss'},
  ]

  deleteAction = (): Delete<StudyProgramAtom> => ({
    labelForDialog: (sp) => sp.label,
    delete: a => this.http.delete(a.id)
  })

  createAction = (): [Create<StudyProgram>, CreateDialogData] => [
    {
      create: attrs => mapOpt(this.parseProtocol(attrs), this.http.create) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    {
      objectName: 'Studiengang',
      inputs: this.createInputs()
    }
  ]

  updateAction = (): [Update<StudyProgramAtom, StudyProgram>, (sp: StudyProgramAtom) => CreateDialogData] => [
    {
      update: (sp, attrs) =>
        mapOpt(
          this.createProtocol(sp, attrs),
          p => this.http.update(p, sp.id)
        ) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    m => ({
      objectName: 'Studiengang',
      inputs: this.updateInputs(m)
    })
  ]

  private createInputs = (): FormInput[] => [
    this.label,
    this.abbreviation,
    this.teachingUnit,
    this.graduation,
  ]

  private updateInputs = (sp: StudyProgramAtom): FormInput[] => [
    {...this.label, initialValue: sp.label},
    {...this.abbreviation, initialValue: sp.abbreviation},
    {...this.teachingUnit, initialValue: (tus: TeachingUnit[]) => tus.find(tu => tu.id === sp.teachingUnit.id)},
    {...this.graduation, initialValue: (gs: Graduation[]) => gs.find(g => g.id === sp.graduation.id)},
  ]

  studyPrograms = (): Observable<StudyProgramAtom[]> =>
    this.http.studyProgramsAtomic()

  private parseProtocol = (attrs: { [p: string]: string }): StudyProgramProtocol | undefined =>
    mapOpt(
      zip(
        parseTeachingUnit(attrs.teachingUnit),
        parseGraduation(attrs.graduation)
      ),
      ([tu, g]) => ({
        label: attrs.label,
        abbreviation: attrs.abbreviation,
        teachingUnit: tu.id,
        graduation: g.id
      })
    )

  private createProtocol = (sp: StudyProgramAtom, attrs: { [p: string]: string }): StudyProgramProtocol | undefined =>
    this.parseProtocol({
      ...attrs,
      teachingUnit: JSON.parse(JSON.stringify(attrs.teachingUnit)),
      graduation: JSON.parse(JSON.stringify(attrs.graduation))
    })
}
