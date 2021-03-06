import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {ScheduleComponent} from './schedule/schedule.component'
import {StudyProgramsComponent} from './admin/study-programs/study-programs.component'
import {ExaminationRegulationsComponent} from './admin/examination-regulations/examination-regulations.component'
import {ModulesComponent} from './admin/modules/modules.component'
import {SubmoduleComponent} from './admin/submodule/submodule.component'
import {ModuleExaminationRegulationsComponent} from './admin/module-examination-regulations/module-examination-regulations.component'
import {SemestersComponent} from './admin/semesters/semesters.component'
import {UsersComponent} from './admin/users/users.component'
import {LecturerModulesComponent} from './lecturer-modules/lecturer-modules.component'
import {ScheduleVerificationComponent} from './schedule/schedule-verification/schedule-verification.component'

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
    path: 'examinationRegulations',
    component: ExaminationRegulationsComponent
  },
  {
    path: 'moduleExaminationRegulations',
    component: ModuleExaminationRegulationsComponent
  },
  {
    path: 'modules',
    component: ModulesComponent
  },
  {
    path: 'submodules',
    component: SubmoduleComponent
  },
  {
    path: 'semesters',
    component: SemestersComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'scheduleVerification',
    component: ScheduleVerificationComponent
  },
  {
    path: 'lecturer/:id/modules',
    component: LecturerModulesComponent
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
