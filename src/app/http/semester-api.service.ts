import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {applyFilter, nonAtomicParams} from './http-filter'
import {Semester} from '../models/semester'
import {map} from 'rxjs/operators'
import {HttpParams} from '@angular/common/http'

export type SemesterProtocol = Omit<SemesterJSON, 'id'>

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
    this.http.getAll<SemesterJSON>(this.resource, nonAtomicParams)
      .pipe(map(this.parseSemesterJSON))

  currentSemester = (): Observable<Semester | undefined> =>
    this.single(applyFilter(nonAtomicParams, [{key: 'select', value: 'current'}]))

  draftSemester = (): Observable<Semester | undefined> =>
    this.single(applyFilter(nonAtomicParams, [{key: 'select', value: 'draft'}]))

  delete = (id: string): Observable<Semester> =>
    this.http.delete(`${this.resource}/${id}`)

  create = (p: SemesterProtocol): Observable<Semester> =>
    this.http.create(this.resource, p)

  update = (p: SemesterProtocol, id: string): Observable<Semester> =>
    this.http.put(`${this.resource}/${id}`, p)

  private single = (params: HttpParams) =>
    this.http.getAll<SemesterJSON>(this.resource, params)
      .pipe(map(xs => this.parseSemesterJSON(xs).shift()))

  private parseSemesterJSON = (ss: SemesterJSON[]): Semester[] =>
    ss.map(s => ({
      ...s,
      start: new Date(s.start),
      end: new Date(s.end),
      lectureStart: new Date(s.lectureStart),
      lectureEnd: new Date(s.lectureEnd),
    }))
}
