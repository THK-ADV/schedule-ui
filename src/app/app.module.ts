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
    AdminMenuComponent
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
