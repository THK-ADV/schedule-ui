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

  coursesForCurrentSemester = (): Observable<CourseAtom[]> => {
    const currentSemester = 'ee7d4f03-e767-4713-97d3-15a3b86eede8'
    const params = atomicParams.set('semester', currentSemester)
    return this.http.getAll('courses', params)
  }
}
