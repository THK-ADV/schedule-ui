import {NumberInput, TextInput, URLInput} from './input-text/input-text.component'
import {AutoCompleteInput} from './input-auto-complete/input-auto-complete.component'
import {UntypedFormControl} from '@angular/forms'
import {DateInput} from './input-date/input-date.component'
import {BooleanInput} from './input-boolean/input-boolean.component'

export interface FormInputLike {
  label: string
  disabled: boolean,
  required: boolean
  kind: string
  attr: string
}

export type FormInput =
  TextInput |
  NumberInput |
  BooleanInput |
  URLInput |
  AutoCompleteInput<any> |
  DateInput

export const combine = (
  fs: Array<(i: FormInput) => UntypedFormControl | undefined>
): (i: FormInput) => UntypedFormControl | undefined =>
  i => {
    for (const f of fs) {
      const res = f(i)
      if (res) {
        return res
      }
    }
    return undefined
  }
