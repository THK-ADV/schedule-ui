import {Injectable} from '@angular/core'
import {SemesterApiService} from '../../http/semester-api.service'
import {EMPTY, Observable} from 'rxjs'
import {Semester} from '../../models/semester'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {TextInput} from '../../generic-ui/create-dialog/input-text/input-text.component'
import {DateInput} from '../../generic-ui/create-dialog/input-date/input-date.component'
import {FormInput} from '../../generic-ui/create-dialog/form-input'
import {mapOpt, zip4} from '../../utils/optional'
import {parseDate} from '../../utils/parser'
import {formatDate} from '../../utils/date-format'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'

interface SemesterProtocol {
  label: string
  abbreviation: string
  start: string
  end: string
  lectureStart: string
  lectureEnd: string
}

@Injectable({
  providedIn: 'root'
})
export class SemestersService {

  readonly label: TextInput
  readonly abbreviation: TextInput
  readonly start: DateInput
  readonly end: DateInput
  readonly lectureStart: DateInput
  readonly lectureEnd: DateInput

  constructor(private readonly http: SemesterApiService) {
    this.label = {
      label: 'Bezeichnung',
      attr: 'label',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.abbreviation = {
      label: 'Abkürzung',
      attr: 'abbreviation',
      disabled: false,
      required: true,
      kind: 'text'
    }
    this.start = {
      label: 'Beginn',
      attr: 'start',
      disabled: false,
      required: true,
      kind: 'date'
    }
    this.end = {
      label: 'Ende',
      attr: 'end',
      disabled: false,
      required: true,
      kind: 'date'
    }
    this.lectureStart = {
      label: 'Vorlesungsbeginn',
      attr: 'lectureStart',
      disabled: false,
      required: true,
      kind: 'date'
    }
    this.lectureEnd = {
      label: 'Vorlesungsende',
      attr: 'lectureEnd',
      disabled: false,
      required: true,
      kind: 'date'
    }
  }

  columns = (): TableHeaderColumn[] => [
    {attr: 'label', title: 'Bezeichnung'},
    {attr: 'abbreviation', title: 'Abkürzung'},
    {attr: 'start', title: 'Beginn'},
    {attr: 'end', title: 'Ende'},
    {attr: 'lectureStart', title: 'Vorlesungsbeginn'},
    {attr: 'lectureEnd', title: 'Vorlesungsende'}
  ]

  deleteAction = (): Delete<Semester> => ({
    labelForDialog: a => a.label,
    delete: a => this.http.delete(a.id)
  })

  createAction = (): [Create<Semester>, CreateDialogData] => [
    {
      create: attrs => mapOpt(this.parseProtocol(attrs), this.http.create) ?? EMPTY,
      show: a => JSON.stringify(a)
    },
    {
      objectName: 'Semester',
      inputs: this.createInputs()
    }
  ]

  updateAction = (): [Update<Semester, Semester>, (e: Semester) => CreateDialogData] => [
    {
      update: (m, attrs) =>
        mapOpt(
          this.createProtocol(m, attrs),
          p => this.http.update(p, m.id)
        ) ?? EMPTY
      ,
      show: a => JSON.stringify(a)
    },
    m => ({
      objectName: 'Semester',
      inputs: this.updateInputs(m)
    })
  ]

  semesters = (): Observable<Semester[]> =>
    this.http.semesters()

  private createInputs = (): FormInput[] => [
    this.label,
    this.abbreviation,
    this.start,
    this.end,
    this.lectureStart,
    this.lectureEnd,
  ]

  private updateInputs = (s: Semester): FormInput[] => [
    {...this.label, initialValue: s.label},
    {...this.abbreviation, initialValue: s.abbreviation},
    {...this.start, initialValue: s.start},
    {...this.end, initialValue: s.end},
    {...this.lectureStart, initialValue: s.lectureStart},
    {...this.lectureEnd, initialValue: s.lectureEnd},
  ]

  private parseProtocol = (attrs: { [p: string]: string }): SemesterProtocol | undefined =>
    mapOpt(
      zip4(
        parseDate(attrs.start),
        parseDate(attrs.end),
        parseDate(attrs.lectureStart),
        parseDate(attrs.lectureEnd),
      ),
      ([s, e, ls, le]) => ({
        label: attrs.label,
        abbreviation: attrs.abbreviation,
        start: formatDate(s, 'yyyy-MM-dd'),
        end: formatDate(e, 'yyyy-MM-dd'),
        lectureStart: formatDate(ls, 'yyyy-MM-dd'),
        lectureEnd: formatDate(le, 'yyyy-MM-dd')
      })
    )

  private createProtocol = (s: Semester, attrs: { [p: string]: string }): SemesterProtocol | undefined =>
    this.parseProtocol({...attrs})
}
