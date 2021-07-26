import {Component} from '@angular/core'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {ExaminationRegulation, ExaminationRegulationAtom} from '../../models/examination-regulation'
import {ExaminationRegulationProtocol, ExaminationRegulationsService} from './examination-regulations.service'
import {formatDate} from '../../utils/date-format'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'
import {AutoCompleteInput} from '../../generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {StudyProgramAtom} from '../../models/study-program'
import {StudyProgramApiService} from '../../http/study-program-api.service'
import {NumberInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {DateInput} from '../../generic-ui/create-dialog/input-date/input-date.component'
import {parseDate, parseIntNumber, parseStudyProgramAtom} from '../../utils/parser'
import {mapOpt, zip3} from '../../utils/optional'

const showStudyProgram = (sp: StudyProgramAtom) =>
  `${sp.label} (${sp.abbreviation} ${sp.graduation.abbreviation})`

const parseProtocol = (attrs: { [p: string]: string }): ExaminationRegulationProtocol | undefined =>
  mapOpt(
    zip3(
      parseStudyProgramAtom(attrs.sp),
      parseIntNumber(attrs.po),
      parseDate(attrs.start)
    ),
    ([sp, po, d]) => ({
      studyProgram: sp.id,
      number: po,
      start: d,
    })
  )

@Component({
  selector: 'schd-examination-regulations',
  templateUrl: './examination-regulations.component.html',
  styleUrls: ['./examination-regulations.component.scss']
})
export class ExaminationRegulationsComponent {

  headerTitle = 'Prüfungsordnungen'
  tooltipTitle = 'Prüfungsordnung hinzufügen'

  columns: TableHeaderColumn[]
  data: () => Observable<ExaminationRegulationAtom[]>
  filterAttrs: string[]

  delete: Delete<ExaminationRegulationAtom>
  create: [Create<ExaminationRegulationProtocol>, CreateDialogData]
  update: [Update<ExaminationRegulationAtom, ExaminationRegulation>, (e: ExaminationRegulationAtom) => CreateDialogData]

  constructor(
    private readonly service: ExaminationRegulationsService,
    private readonly spService: StudyProgramApiService,
  ) {
    this.columns = [
      {attr: 'studyProgram', title: 'Studiengang'},
      {attr: 'number', title: 'PO Nummer'},
      {attr: 'start', title: 'Start'},
      {attr: 'end', title: 'Ende'},
    ]
    this.filterAttrs = this.columns.map(_ => _.title)
    this.data = service.examinationRegulations
    this.delete = {
      labelForDialog: a => showStudyProgram(a.studyProgram),
      delete: service.delete
    }
    const spInput: AutoCompleteInput<StudyProgramAtom> = {
      label: 'Studiengang',
      attr: 'sp',
      disabled: false,
      required: true,
      data: spService.studyProgramsAtomic(),
      show: showStudyProgram,
      kind: 'auto-complete'
    }
    const spEditInput = (e: ExaminationRegulationAtom): AutoCompleteInput<StudyProgramAtom> => ({
      ...spInput,
      disabled: true,
      initialValue: sps => sps.find(_ => _.id === e.studyProgram.id)
    })

    const poInput: NumberInput = {
      label: 'PO Nummer',
      attr: 'po',
      disabled: false,
      required: true,
      min: 1,
      kind: 'number'
    }
    const poEditInput = (e: ExaminationRegulationAtom): NumberInput => ({
      ...poInput,
      disabled: true,
      initialValue: e.number
    })

    const startInput: DateInput = {
      label: 'Start',
      attr: 'start',
      disabled: false,
      required: true,
      kind: 'date'
    }

    const startEditInput = (e: ExaminationRegulationAtom): DateInput => ({
      ...startInput,
      disabled: false,
      initialValue: e.start
    })

    const endEditInput = (e: ExaminationRegulationAtom): DateInput => ({
      label: 'Ende',
      attr: 'end',
      disabled: false,
      required: false,
      kind: 'date',
      initialValue: e.end
    })

    this.create = [
      {
        create: attrs => mapOpt(parseProtocol(attrs), service.create) ?? EMPTY,
        show: a => JSON.stringify(a)
      },
      {
        objectName: 'Prüfungsordnung',
        inputs: [spInput, poInput, startInput]
      }
    ]
    this.update = [
      {
        update: (a, attrs) => {
          const start = parseDate(attrs.start)
          if (!start) {
            return EMPTY
          }

          const ep: ExaminationRegulationProtocol = {
            studyProgram: a.studyProgram.id,
            number: a.number,
            start,
            end: mapOpt(attrs.end, parseDate)
          }
          return service.update(ep, a.id)
        },
        show: a => JSON.stringify(a)
      },
      e => ({
        objectName: 'Prüfungsordnung',
        inputs: [spEditInput(e), poEditInput(e), startEditInput(e), endEditInput(e)]
      })
    ]
  }

  tableContent = (exam: ExaminationRegulationAtom, attr: string): string => {
    switch (attr) {
      case 'studyProgram':
        return showStudyProgram(exam.studyProgram)
      case 'number':
        return exam.number.toString()
      case 'start':
        return formatDate(exam.start, 'dd.MM.yyyy')
      case 'end':
        return exam.end ? formatDate(exam.end, 'dd.MM.yyyy') : '-'
      default:
        return '???'
    }
  }

  sortingDataAccessor = (exam: ExaminationRegulationAtom, attr: string): any => {
    switch (attr) {
      case 'start':
        return new Date(exam.start)
      case 'end':
        return exam.end ? new Date(exam.end) : '-'
      default:
        return this.tableContent(exam, attr)
    }
  }

}
