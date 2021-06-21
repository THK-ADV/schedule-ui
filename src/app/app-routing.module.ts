import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {ScheduleComponent} from './schedule/schedule.component'
import {StudyProgramsComponent} from './admin/study-programs/study-programs.component'

const routes: Routes = [
  {
    path: 'schedule',
    component: ScheduleComponent
  },
  {
    path: 'studyPaths',
    component: StudyProgramsComponent
  },
  {
    path: '',
    redirectTo: 'schedule',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
