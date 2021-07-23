import {NumberInput, TextInput, URLInput} from './input-text/input-text.component'
import {AutoCompleteInput} from './input-auto-complete/input-auto-complete.component'
import {FormControl} from '@angular/forms'
import {DateInput} from './input-date/input-date.component'

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
  URLInput |
  AutoCompleteInput<any> |
  DateInput

export const combine = (
  fs: Array<(i: FormInput) => FormControl | undefined>
): (i: FormInput) => FormControl | undefined =>
  i => {
    for (const f of fs) {
      const res = f(i)
      if (res) {
        return res
      }
    }
    return undefined
  }
