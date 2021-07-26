import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {nonAtomicParams} from './http-filter'
import {Semester} from '../models/semester'
import {map} from 'rxjs/operators'

interface SemesterJSON {
  label: string
  abbreviation: string
  start: string
  end: string
  lectureStart: string
  lectureEnd: string
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class SemesterApiService {

  private readonly resource = 'semesters'

  constructor(private readonly http: HttpService) {
  }

  semesters = (): Observable<Semester[]> =>
    this.http.getAll<SemesterJSON>(this.resource, nonAtomicParams).pipe(
      map(this.parseSemesterJSON)
    )

  private parseSemesterJSON = (ss: SemesterJSON[]): Semester[] =>
    ss.map(s => ({
      ...s,
      start: new Date(s.start),
      end: new Date(s.end),
      lectureStart: new Date(s.lectureStart),
      lectureEnd: new Date(s.lectureEnd),
    }))
}
