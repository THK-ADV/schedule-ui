import {NgModule} from '@angular/core'
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete'
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input'
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field'
import {ReactiveFormsModule} from '@angular/forms'
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button'
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu'
import {MatIconModule} from '@angular/material/icon'
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip'
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table'
import {MatSortModule} from '@angular/material/sort'
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator'
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle'
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";


@NgModule({
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class ScheduleMaterialModule {
}
