import {Injectable} from '@angular/core'
import {ExaminationRegulationApiService} from '../../http/examination-regulation-api.service'

@Injectable({
  providedIn: 'root'
})
export class ExaminationRegulationsService {

  constructor(private readonly http: ExaminationRegulationApiService) {
  }

  examinationRegulations = () =>
    this.http.examinationRegulations()
}
