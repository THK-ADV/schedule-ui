import {Injectable} from '@angular/core'
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {timeFromString} from '../models/time'

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

  constructor(private readonly http: HttpClient) {
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      )
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.'
    )
  }

  getAll = <A>(url: string, params: HttpParams): Observable<A[]> =>
    this.http.get<A[]>(url, {params})
      .pipe(catchError(this.handleError))

  post = <A>(url: string, body: unknown, params?: HttpParams): Observable<A[]> =>
    this.http.post<A[]>(url, body, { params })
      .pipe(catchError(this.handleError))

  delete = <A>(url: string): Observable<A> =>
    this.http.delete<A>(url)
      .pipe(catchError(this.handleError))
}
