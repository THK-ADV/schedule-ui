import {DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter} from '@angular/material/core'
import {Injectable} from '@angular/core'
import {formatDate} from '../utils/date-format'

const DATE_FORMATS = {
  display: {
    dateInput: 'localDate',
    monthYearLabel: 'monthYearLabel',
  }
}

@Injectable()
export class DefaultDateAdapter extends NativeDateAdapter {

  static defaultProviders = () => [
    {provide: DateAdapter, useClass: DefaultDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS}
  ]

  getFirstDayOfWeek = (): number => 1

  format = (date: Date, displayFormat: any): string => {
    switch (displayFormat) {
      case DATE_FORMATS.display.dateInput:
        return formatDate(date, 'dd.MM.yyyy')
      case DATE_FORMATS.display.monthYearLabel:
        return date.toLocaleDateString('de-DE', {month: 'short', year: 'numeric'})
      default:
        return super.format(date, displayFormat)
    }
  }
}
