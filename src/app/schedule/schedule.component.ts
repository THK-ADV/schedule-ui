import {Component} from '@angular/core'
import {fakeGraduation, fakeStudyProgram, fakeTeachingUnit, Graduation, StudyProgram, TeachingUnit} from '../mocks'

@Component({
  selector: 'schd-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {

  teachingUnits = fakeTeachingUnit
  graduations = fakeGraduation
  allStudyPrograms = fakeStudyProgram
  currentStudyPrograms = fakeStudyProgram

  private tu?: TeachingUnit
  private g?: Graduation

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

  private filterStudyPrograms = () => {
    const filters: ((s: StudyProgram) => boolean)[] = []
    const tu = this.tu
    const g = this.g

    if (tu) {
      filters.push(s => s.teachingUnit === tu.id)
    }

    if (g) {
      filters.push(s => s.graduation === g.id)
    }

    if (filters.length === 0) {
      this.currentStudyPrograms = this.allStudyPrograms
    } else {
      this.currentStudyPrograms = this.allStudyPrograms.filter(filters.reduce((a, b) => ss => a(ss) && b(ss)))
    }
  }

}
