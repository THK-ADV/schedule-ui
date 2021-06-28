import {Component} from '@angular/core'
import {StudyProgramsService} from './study-programs.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {EMPTY, Observable} from 'rxjs'
import {StudyProgramAtom} from '../../models/study-program'
import {Create, Delete} from '../../generic-ui/crud-table/crud-table.component'

@Component({
  selector: 'schd-study-programs',
  templateUrl: './study-programs.component.html',
  styleUrls: ['./study-programs.component.scss']
})
export class StudyProgramsComponent {

  headerTitle = 'Studiengänge'
  tooltipTitle = 'Studiengang hinzufügen'
  columns: TableHeaderColumn[]
  data: () => Observable<StudyProgramAtom[]>
  delete: Delete<StudyProgramAtom>
  create: Create<never, StudyProgramAtom>

  constructor(private readonly service: StudyProgramsService) {
    this.columns = [
      {attr: 'label', title: 'Bezeichnung'},
      {attr: 'abbreviation', title: 'Abkürzung'},
      {attr: 'teachingUnit.label', title: 'Lehreinheit'},
      {attr: 'graduation.abbreviation', title: 'Abschluss'},
    ]
    this.data = service.studyPrograms
    this.delete = {
      labelForDialog: (sp) => sp.label,
      delete: service.delete
    }
    this.create = {
      create: (a) => EMPTY
    }
  }
}
