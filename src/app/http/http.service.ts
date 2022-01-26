import {Injectable} from '@angular/core'
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http'
import {EMPTY, Observable} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {timeFromString} from '../models/time'
import {Alert, AlertService} from '../structure/alert/alert.service'

export const parseDateStartEndFromJSON = <A>(a: any): A => {
  const date = new Date(a.date)
  const start = timeFromString(a.start, date)
  const end = timeFromString(a.end, date)

  return {...a, date, start, end}
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly http: HttpClient,
    private readonly alert: AlertService
  ) {
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let alert: Alert
    if (error.status === 0) {
      alert = {
        type: 'danger',
        body: {
          kind: 'message',
          value: `An error occurred: ${JSON.stringify(error.error)}`
        }
      }
    } else {
      alert = {
        type: 'danger',
        body: {
          kind: 'message',
          value: `Backend returned code: ${error.status} with message: ${JSON.stringify(error.error)}`
        }
      }
    }
    console.error(alert.body.value)
    this.alert.reportAlert(alert)
    return EMPTY
  }

  getAll = <A>(url: string, params: HttpParams): Observable<A[]> =>
    this.http.get<A[]>(url, {params})
      .pipe(catchError(this.handleError))

  get = <A>(url: string, params: HttpParams): Observable<A> =>
    this.http.get<A>(url, {params})
      .pipe(catchError(this.handleError))

  post = <A>(url: string, body: unknown, params?: HttpParams): Observable<A[]> =>
    this.http.post<A[]>(url, body, {params})
      .pipe(catchError(this.handleError))

  delete = <A>(url: string): Observable<A> =>
    this.http.delete<A>(url)
      .pipe(catchError(this.handleError))

  create = <I, O>(url: string, body: I): Observable<O> =>
    this.http.post<O>(url, body)
      .pipe(catchError(this.handleError))

  put = <I, O>(url: string, body: I): Observable<O> =>
    this.http.put<O>(url, body)
      .pipe(catchError(this.handleError))
}
