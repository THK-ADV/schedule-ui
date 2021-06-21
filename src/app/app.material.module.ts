import {NgModule} from '@angular/core'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {ReactiveFormsModule} from '@angular/forms'
import {MatButtonModule} from '@angular/material/button'
import {MatMenuModule} from '@angular/material/menu'
import {MatIconModule} from '@angular/material/icon'


@NgModule({
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class ScheduleMaterialModule {
}
