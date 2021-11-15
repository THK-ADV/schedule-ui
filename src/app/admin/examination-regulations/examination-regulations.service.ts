import {Injectable} from '@angular/core'
import {ExaminationRegulationApiService} from '../../http/examination-regulation-api.service'
import {EMPTY} from 'rxjs'
import {ExaminationRegulation, ExaminationRegulationAtom} from '../../models/examination-regulation'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {mapOpt, zip3} from '../../utils/optional'
import {parseDate, parseIntNumber, parseStudyProgramAtom} from '../../utils/parser'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {StudyProgramAtom} from '../../models/study-program'
import {StudyProgramApiService} from '../../http/study-program-api.service'
import {describeStudyProgramAtom} from '../../utils/describe'
import {NumberInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {DateInput} from '../../generic-ui/create-dialog/input-date/input-date.component'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {formatDate} from '../../utils/date-format'

export interface ExaminationRegulationProtocol {
  studyProgram: string
  number: number
  start: string
  end: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class ExaminationRegulationsService {

  private readonly studyProgram: AutoCompleteInput<StudyProgramAtom>
  private readonly po: NumberInput
  private readonly start: DateInput
  private readonly end: DateInput

  constructor(
    private readonly http: ExaminationRegulationApiService,
    private readonly spService: StudyProgramApiService
  ) {
    this.studyProgram = {
      label: 'Studiengang',
      attr: 'studyProgram',
      disabled: false,
      required: true,
      data: spService.studyProgramsAtomic(),
      show: describeStudyProgramAtom,
      kind: 'auto-complete'
    }
    this.po = {
      label: 'PO Nummer',
      attr: 'po',
      disabled: false,
      required: true,
      min: 1,
      kind: 'number'
    }
    this.start = {
      label: 'Start',
      attr: 'start',
      disabled: false,
      required: true,
      kind: 'date'
    }
    this.end = {
      label: 'Ende',
      attr: 'end',
      disabled: false,
      required: false,
      kind: 'date'
    }
  }

  examinationRegulations = () =>
    this.http.examinationRegulations()

  columns = (): TableHeaderColumn[] => [
    {attr: 'studyProgram', title: 'Studiengang'},
    {attr: 'number', title: 'PO Nummer'},
    {attr: 'start', title: 'Start'},
    {attr: 'end', title: 'Ende'},
  ]

  deleteAction = (): Delete<ExaminationRegulationAtom> => ({
    labelForDialog: a => describeStudyProgramAtom(a.studyProgram),
    delete: a => this.http.delete(a.id)
  })

  createAction = (): [Create<ExaminationRegulation>, CreateDialogData] => [
    {
      create: attrs => mapOpt(this.parseProtocol(attrs), this.http.create) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    {
      objectName: 'Prüfungsordnung',
      inputs: this.createInputs()
    }
  ]

  updateAction = (): [Update<ExaminationRegulationAtom, ExaminationRegulation>, (e: ExaminationRegulationAtom) => CreateDialogData] => [
    {
      update: (m, attrs) =>
        mapOpt(
          this.createProtocol(m, attrs),
          p => this.http.update(p, m.id)
        ) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    m => ({
      objectName: 'Modul',
      inputs: this.updateInputs(m)
    })
  ]

  private createInputs = (): FormInput[] => [
    this.studyProgram,
    this.po,
    this.start,
    this.end
  ]

  private updateInputs = (e: ExaminationRegulationAtom): FormInput[] => [
    {...this.studyProgram, initialValue: (sps: StudyProgramAtom[]) => sps.find(_ => _.id === e.studyProgram.id)},
    {...this.po, initialValue: e.number},
    {...this.start, initialValue: e.start},
    {...this.end, initialValue: e.end},
  ]

  private parseProtocol = (attrs: { [p: string]: string }): ExaminationRegulationProtocol | undefined =>
    mapOpt(
      zip3(
        parseStudyProgramAtom(attrs.studyProgram),
        parseIntNumber(attrs.po),
        parseDate(attrs.start),
      ),
      ([sp, po, d]) => ({
        studyProgram: sp.id,
        number: po,
        start: formatDate(d, 'yyyy-MM-dd'),
        end: mapOpt(parseDate(attrs.end), a => formatDate(a, 'yyyy-MM-dd'))
      })
    )

  private createProtocol = (e: ExaminationRegulationAtom, attrs: { [p: string]: string }): ExaminationRegulationProtocol | undefined =>
    this.parseProtocol({...attrs})
}
