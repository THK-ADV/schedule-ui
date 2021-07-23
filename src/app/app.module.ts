import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import {ScheduleMaterialModule} from './app.material.module'
import {HeaderComponent} from './structure/header/header.component'
import {NavComponent} from './structure/nav/nav.component'
import {FilterOptionComponent} from './schedule/filter-option/filter-option.component'
import {FilterComponent} from './schedule/filter/filter.component'
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import {BackendUrlInterceptorInterceptor} from './http/backend-url-interceptor.interceptor'
import {ScheduleComponent} from './schedule/schedule.component'
import {ScheduleViewComponent} from './schedule/schedule-view/schedule-view.component'
import {FullCalendarModule} from '@fullcalendar/angular'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import {LoginComponent} from './login/login/login.component'
import {AdminMenuComponent} from './structure/admin-menu/admin-menu.component'
import {StudyProgramsComponent} from './admin/study-programs/study-programs.component'
import {TableComponent} from './generic-ui/table/table.component'
import {ExaminationRegulationsComponent} from './admin/examination-regulations/examination-regulations.component'
import {HeaderButtonComponent} from './generic-ui/header-button/header-button.component'
import {CrudTableComponent} from './generic-ui/crud-table/crud-table.component'
import {DeleteDialogComponent} from './generic-ui/delete-dialog/delete-dialog.component'
import {AlertComponent} from './structure/alert/alert.component'
import {CreateDialogComponent} from './generic-ui/create-dialog/create-dialog.component'
import {InputTextComponent} from './generic-ui/create-dialog/input-text/input-text.component'
import {InputAutoCompleteComponent} from './generic-ui/create-dialog/input-auto-complete/input-auto-complete.component'
import {InputDateComponent} from './generic-ui/create-dialog/input-date/input-date.component'
import {ModulesComponent} from './admin/modules/modules.component'

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
])

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FilterOptionComponent,
    FilterComponent,
    ScheduleComponent,
    ScheduleViewComponent,
    LoginComponent,
    AdminMenuComponent,
    StudyProgramsComponent,
    TableComponent,
    ExaminationRegulationsComponent,
    HeaderButtonComponent,
    CrudTableComponent,
    DeleteDialogComponent,
    AlertComponent,
    CreateDialogComponent,
    InputTextComponent,
    InputAutoCompleteComponent,
    InputDateComponent,
    ModulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ScheduleMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FullCalendarModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: BackendUrlInterceptorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
