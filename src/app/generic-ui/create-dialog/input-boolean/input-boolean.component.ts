import {Component, Input, OnInit} from '@angular/core'
import {UntypedFormControl, Validators} from '@angular/forms'
import {FormInput, FormInputLike} from '../form-input'

export interface BooleanInput extends FormInputLike {
  initialValue?: boolean
  kind: 'boolean'
}

export const formControlForBooleanInput = (i: FormInput): UntypedFormControl | undefined => {
  switch (i.kind) {
    case 'boolean':
      return new UntypedFormControl(
        {value: i.initialValue ?? false, disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    default:
      return undefined
  }
}

@Component({
  selector: 'schd-input-boolean',
  templateUrl: './input-boolean.component.html',
  styleUrls: ['./input-boolean.component.scss']
})
export class InputBooleanComponent implements OnInit {
  value = false

  @Input() formControl!: UntypedFormControl
  @Input() input!: BooleanInput

  ngOnInit(): void {
    this.value = this.input.initialValue ?? false
  }
}
