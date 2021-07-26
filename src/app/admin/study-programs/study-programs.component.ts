import {Component} from '@angular/core'
import {StudyProgramsService} from './study-programs.service'
import {TableHeaderColumn} from '../../generic-ui/table/table.component'
import {Observable} from 'rxjs'
import {StudyProgram, StudyProgramAtom} from '../../models/study-program'
import {Create, Delete, Update} from '../../generic-ui/crud-table/crud-table.component'
import {CreateDialogData} from '../../generic-ui/create-dialog/create-dialog.component'

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
  create: [Create<StudyProgram>, CreateDialogData]
  update: [Update<StudyProgramAtom, StudyProgram>, (sp: StudyProgramAtom) => CreateDialogData]

  constructor(
    private readonly service: StudyProgramsService,
  ) {
    this.columns = service.columns()
    this.data = service.studyPrograms
    this.delete = service.deleteAction()
    this.create = service.createAction()
    this.update = service.updateAction()
  }
}
