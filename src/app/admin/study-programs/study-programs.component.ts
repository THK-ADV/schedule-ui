import {Component} from '@angular/core'
import {StudyProgramsService} from './study-programs.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {StudyProgramAtom} from '../../models/study-program'

@Component({
  selector: 'schd-study-programs',
  templateUrl: './study-programs.component.html',
  styleUrls: ['./study-programs.component.scss']
})
export class StudyProgramsComponent {

  headerTitle = 'Studiengänge'
  tooltipTitle = 'Studiengang hinzufügen'
  columns: TableHeaderColumn[]
  data: Observable<StudyProgramAtom[]>

  constructor(private readonly service: StudyProgramsService) {
    this.columns = [
      {attr: 'label', title: 'Bezeichnung'},
      {attr: 'abbreviation', title: 'Abkürzung'},
      {attr: 'teachingUnit.label', title: 'Lehreinheit'},
      {attr: 'graduation.abbreviation', title: 'Abschluss'},
    ]
    this.data = service.studyPrograms()
  }

  delete = (sp: StudyProgramAtom) =>
    console.log('delete', sp)

  edit = (sp: StudyProgramAtom) =>
    console.log('edit', sp)

  select = (sp: StudyProgramAtom) =>
    console.log('select', sp)

  create = () =>
    console.log('create')
}
