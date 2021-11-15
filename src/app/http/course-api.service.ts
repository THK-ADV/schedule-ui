import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {CourseAtom} from '../models/course'
import {atomicParams} from './http-filter'

@Injectable({
  providedIn: 'root'
})
export class CourseApiService {

  constructor(private readonly http: HttpService) {
  }

  coursesForCurrentSemester = (semesterId: string): Observable<CourseAtom[]> =>
    this.http.getAll('courses', atomicParams.set('semester', semesterId))
}
