import {Component, OnInit} from '@angular/core'
import {Graduation, fakeGraduation, StudyProgram, fakeStudyProgram, TeachingUnit, fakeTeachingUnit} from './mocks'

@Component({
  selector: 'schd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'schedule-ui'

  teachingUnits = fakeTeachingUnit
  graduations = fakeGraduation
  allStudyPrograms = fakeStudyProgram
  currentStudyPrograms = fakeStudyProgram

  tu: TeachingUnit | undefined
  g: Graduation | undefined

  displayTU = (tu: TeachingUnit) => tu.label
  displayG = (g: Graduation) => g.label
  displaySP = (sp: StudyProgram) => sp.label

  selectedTU = (tu?: TeachingUnit) => {
    this.tu = tu
    this.filterStudyPrograms()
  }
  selectedG = (g?: Graduation) => {
    this.g = g
    this.filterStudyPrograms()
  }

  filterStudyPrograms = () => {
    const filters: ((s: StudyProgram) => boolean)[] = []
    if (this.tu) {
      filters.push(s => s.teachingUnit === this.tu!!.id)
    }
    if (this.g) {
      filters.push(s => s.graduation === this.g!!.id)
    }
    if (filters.length === 0) {
      this.currentStudyPrograms = this.allStudyPrograms
    } else {
      this.currentStudyPrograms = this.allStudyPrograms.filter(filters.reduce((a, b) => ss => a(ss) && b(ss)))
    }
  }
}
