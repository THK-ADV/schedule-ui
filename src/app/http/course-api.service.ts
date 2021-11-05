import {Injectable} from '@angular/core'
import {HttpService} from './http.service'
import {Observable} from 'rxjs'
import {CourseAtom} from '../models/course'
import {atomicParams} from './http-filter'
import {environment} from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CourseApiService {

  constructor(private readonly http: HttpService) {
  }

  coursesForCurrentSemester = (): Observable<CourseAtom[]> => {
    const currentSemester = environment.semesterId
    const params = atomicParams.set('semester', currentSemester)
    return this.http.getAll('courses', params)
  }
}
