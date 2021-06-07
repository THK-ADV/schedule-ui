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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FilterOptionComponent,
    FilterComponent,
    ScheduleComponent,
    ScheduleViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ScheduleMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: BackendUrlInterceptorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
