import {Component, Input} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {FormInput, FormInputLike} from '../form-input'

export interface TextInput extends FormInputLike {
  initialValue?: string
  kind: 'text'
}

export interface NumberInput extends FormInputLike {
  initialValue?: number
  min: number
  max?: number
  kind: 'number'
}

export const formControlForTextInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'text':
      return new FormControl({value: i.initialValue, disabled: i.disabled}, Validators.required)
    case 'number':
      const validators = [Validators.required, Validators.min(i.min)]
      if (i.max) {
        validators.push(Validators.max(i.max))
      }
      return new FormControl({value: i.initialValue, disabled: i.disabled}, validators)
    default:
      return undefined
  }
}


@Component({
  selector: 'schd-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {
  @Input() formControl!: FormControl
  @Input() input!: TextInput | NumberInput
}
