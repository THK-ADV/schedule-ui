import {Injectable} from '@angular/core'
import {ModuleExaminationRegulationApiService} from '../../http/module-examination-regulation-api.service'
import {EMPTY, Observable, of} from 'rxjs'
import {ModuleExaminationRegulation, ModuleExaminationRegulationAtom} from '../../models/module-examination-regulation'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {ModuleAtom} from '../../models/module'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {describeExamReg, describeModule, describeModuleAtom} from '../../utils/describe'
import {ModuleApiService} from '../../http/module-api.service'
import {ExaminationRegulationApiService} from '../../http/examination-regulation-api.service'
import {mapOpt, zip3} from '../../utils/optional'
import {parseBoolean, parseExaminationRegulationAtom, parseModuleAtom} from '../../utils/parser'
import {BooleanInput} from '../../generic-ui/create-dialog/input-boolean/input-boolean.component'
import {Create, Delete} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'

interface ModuleExaminationRegulationProtocol {
  module: string
  examinationRegulation: string
  mandatory: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ModuleExaminationRegulationService {

  private readonly module: AutoCompleteInput<ModuleAtom>
  private readonly exam: AutoCompleteInput<ExaminationRegulationAtom>
  private readonly mandatory: BooleanInput

  constructor(
    private readonly http: ModuleExaminationRegulationApiService,
    private readonly moduleService: ModuleApiService,
    private readonly examRegService: ExaminationRegulationApiService,
  ) {
    this.module = {
      label: 'Modul',
      attr: 'module',
      required: true,
      disabled: false,
      show: describeModuleAtom,
      kind: 'auto-complete',
      data: moduleService.modulesAtomic()
    }
    this.exam = {
      label: 'Prüfungsordnung',
      attr: 'examinationRegulation',
      required: true,
      disabled: false,
      show: describeExamReg,
      kind: 'auto-complete',
      data: examRegService.examinationRegulations()
    }
    this.mandatory = {
      label: 'Pflichtmodul',
      attr: 'mandatory',
      disabled: false,
      required: true,
      kind: 'boolean',
    }
  }

  moduleExams = (): Observable<ModuleExaminationRegulationAtom[]> =>
    this.http.moduleExams()

  columns = (): TableHeaderColumn[] => [
    {attr: 'module', title: 'Modul'},
    {attr: 'examinationRegulation', title: 'Prüfungsordnung'},
    {attr: 'mandatory', title: 'Pflichtmodul'}
  ]

  deleteAction = (): Delete<ModuleExaminationRegulationAtom> => ({
    labelForDialog: a => `${describeModule(a.module)} für ${describeExamReg(a.examinationRegulation)}`,
    delete: this.delete
  })

  createAction = (): [Create<ModuleExaminationRegulation>, CreateDialogData] => [
    {
      create: attrs => mapOpt(this.parseProtocol(attrs), this.create) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    {
      objectName: 'Modul mit Prüfungsordnung',
      inputs: this.createInputs()
    }
  ]

  private delete = (me: ModuleExaminationRegulationAtom): Observable<ModuleExaminationRegulationAtom> =>
    of(me)

  private create = (p: ModuleExaminationRegulationProtocol): Observable<ModuleExaminationRegulation> =>
    of({...p, id: 'random uuid'})

  private update = (p: ModuleExaminationRegulationProtocol, id: string): Observable<ModuleExaminationRegulation> =>
    of({...p, id})

  private createInputs = (): FormInput[] => [
    this.module,
    this.exam,
    this.mandatory
  ]

  private parseProtocol = (attrs: { [p: string]: string }): ModuleExaminationRegulationProtocol | undefined =>
    mapOpt(
      zip3(
        parseModuleAtom(attrs.module),
        parseExaminationRegulationAtom(attrs.examinationRegulation),
        parseBoolean(attrs.mandatory)
      ),
      ([m, er, b]) => ({
        module: m.id,
        examinationRegulation: er.id,
        mandatory: b
      })
    )
}
