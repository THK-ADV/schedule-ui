import {HttpParams} from '@angular/common/http'

export interface ParamFilter {
  attribute: string
  value: string
}

export const applyFilter = (filter: ParamFilter[], start: HttpParams = new HttpParams()): HttpParams => {
  return filter.reduce((acc, f) => acc.set(f.attribute, f.value), start)
}

export const nonAtomicParams = new HttpParams().set('atomic', 'false')

export const atomicParams = new HttpParams().set('atomic', 'true')
