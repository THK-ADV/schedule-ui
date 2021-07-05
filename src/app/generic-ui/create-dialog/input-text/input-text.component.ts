import {Component, Input} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {FormInput} from '../create-dialog.component'

export interface TextInput {
  kind: 'text'
  label: string
  attr: string
}

export interface NumberInput {
  kind: 'number'
  label: string
  attr: string
  min: number
  max?: number
}

export const formControlForTextInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'text':
      return new FormControl(undefined, Validators.required)
    case 'number':
      const validators = [Validators.required, Validators.min(i.min)]
      if (i.max) {
        validators.push(Validators.max(i.max))
      }
      return new FormControl(undefined, validators)
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
