import {Component, Input} from '@angular/core'
import {FormInput, FormInputLike} from '../form-input'
import {FormControl, Validators} from '@angular/forms'
import {DefaultDateAdapter} from '../../default-date-adapter.service'

export interface DateInput extends FormInputLike {
  initialValue?: Date
  kind: 'date'
}

export const formControlForDateInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'date':
      return new FormControl(
        {value: i.initialValue, disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    default:
      return undefined
  }
}

@Component({
  selector: 'schd-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: DefaultDateAdapter.defaultProviders()
})
export class InputDateComponent {
  @Input() formControl!: FormControl
  @Input() input!: DateInput
}
