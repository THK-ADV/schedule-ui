import {Component, Input} from '@angular/core'
import {UntypedFormControl, Validators} from '@angular/forms'
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

export interface URLInput extends FormInputLike {
  initialValue?: string
  kind: 'url'
}

export const formControlForTextInput = (i: FormInput): UntypedFormControl | undefined => {
  switch (i.kind) {
    case 'text':
      return new UntypedFormControl(
        {value: i.initialValue, disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    case 'number':
      const validators = [Validators.min(i.min)]
      if (i.required) {
        validators.push(Validators.required)
      }
      if (i.max) {
        validators.push(Validators.max(i.max))
      }
      return new UntypedFormControl({value: i.initialValue, disabled: i.disabled}, validators)
    case 'url':
      const regex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
      return new UntypedFormControl(
        {value: i.initialValue, disabled: i.disabled},
        i.required ? Validators.pattern(regex) : undefined
      )
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
  @Input() formControl!: UntypedFormControl
  @Input() input!: TextInput | NumberInput
}
