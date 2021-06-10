import {formatDate as _formatDate, registerLocaleData} from '@angular/common'
import localDE from '@angular/common/locales/de'
import {Time} from '../models/time'

export type DateTimePattern = 'yyyy-MM-dd' | 'dd.MM.yyyy' | 'dd.MM.yyyy - HH:mm' | 'dd.MM'

export type TimePattern = 'HH:mm:ss' | 'HH:mm'

export const formatDate = (date: Date, pattern: DateTimePattern): string => {
  registerLocaleData(localDE, 'de')
  return _formatDate(date, pattern, 'de')
}

export const formatTime = (time: Time, pattern: TimePattern = 'HH:mm'): string => {
  registerLocaleData(localDE, 'de')
  return _formatDate(time.date, pattern, 'de')
}
