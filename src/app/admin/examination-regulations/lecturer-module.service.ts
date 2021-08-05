import {Injectable} from '@angular/core'
import {SubmoduleApiService} from '../../http/submodule-api.service'
import {ExaminationRegulationApiService} from '../../http/examination-regulation-api.service'
import {SubmoduleAtom} from '../../models/submodule'
import {ExaminationRegulationAtom} from '../../models/examination-regulation'
import {Module} from '../../models/module'
import {EMPTY, Observable} from 'rxjs'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {groupBy, mapGroup} from '../../utils/group-by'
import {map, mergeAll, switchMap, toArray} from 'rxjs/operators'
import {describeExamRegShort, describeLanguage, describeSeason} from '../../utils/describe'

export interface LecturerModule {
  submodules: SubmoduleAtom[]
  exams: ExaminationRegulationAtom[]
  module: Module
}

@Injectable({
  providedIn: 'root'
})
export class LecturerModuleService {

  constructor(
    private readonly submoduleHttp: SubmoduleApiService,
    private readonly examHttp: ExaminationRegulationApiService
  ) {
  }

  lecturerModules = (id: string): Observable<LecturerModule[]> => {
    const submodules$ = this.submoduleHttp.submodules([{key: 'lecturer', value: id}])
    const group = (xs: SubmoduleAtom[]) => groupBy(xs, x => x.module.id)
    const exams$ = (mid: string) => this.examHttp.examinationRegulations([{key: 'module', value: mid}])
    const makeLecturerModule = (
      submodules: SubmoduleAtom[],
      module: Module
    ): (exams: ExaminationRegulationAtom[]) => LecturerModule => exams => ({
      submodules,
      module,
      exams
    })

    return submodules$.pipe(
      map(group),
      switchMap(xs =>
        mapGroup(xs, (k, v) => {
          if (v.length === 0) {
            return EMPTY
          }
          return exams$(k)
            .pipe(map(makeLecturerModule(v, v[0].module)))
        })
      ),
      mergeAll(),
      toArray()
    )
  }

  columns = (): TableHeaderColumn[] => [
    {attr: 'label', title: 'Bezeichnung'},
    {attr: 'abbreviation', title: 'Abkürzung'},
    {attr: 'recommendedSemester', title: 'Fachsemester'},
    {attr: 'credits', title: 'ECTS'},
    {attr: 'language', title: 'Sprache'},
    {attr: 'season', title: 'Angeboten in'},
    {attr: 'descriptionUrl', title: 'Modulbeschreibung'},
    {attr: 'module', title: 'Modulzugehörigkeit'},
    {attr: 'moduleExam', title: 'Angeboten in Studiengängen'},
  ]

  tableContent = (lm: LecturerModule, submodule: SubmoduleAtom, attr: string): string => {
    switch (attr) {
      case 'label':
        return submodule.label
      case 'abbreviation':
        return submodule.abbreviation
      case 'recommendedSemester':
        return submodule.recommendedSemester.toString()
      case 'credits':
        return submodule.credits.toString()
      case 'language':
        return describeLanguage(submodule.language)
      case 'season':
        return describeSeason(submodule.season)
      case 'descriptionUrl':
        return submodule.descriptionUrl
      case 'moduleExam':
        return lm.exams.splice(0, 3).map(describeExamRegShort).join(',')
      default:
        return '???'
    }
  }

  sortingDataAccessor = (a: LecturerModule, attr: string): string => ''

  singleRow = (attr: string) =>
    attr === 'module'

  singleRowContent = (lm: LecturerModule, attr: string): string => {
    switch (attr) {
      case 'module':
        return `${lm.module.abbreviation} (${lm.module.credits} ECTS)`
      default:
        return '???'
    }
  }

  createWPF = () => {
  }
}
