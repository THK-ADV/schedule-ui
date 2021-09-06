import {HttpParams} from '@angular/common/http'

export interface Filter {
  key: string
  value: string
}

export const applyFilter = (start: HttpParams, filter: Filter[] | undefined): HttpParams =>
  filter?.reduce((acc, f) => acc.set(f.key, f.value), start) ?? start

export const nonAtomicParams = new HttpParams().set('atomic', 'false')

export const atomicParams = new HttpParams().set('atomic', 'true')
