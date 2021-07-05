import {NumberInput, TextInput} from './input-text/input-text.component'
import {AutoCompleteInput} from './input-auto-complete/input-auto-complete.component'
import {FormControl} from '@angular/forms'

export interface FormInputLike {
  label: string
  disabled: boolean,
  kind: string
  attr: string
}

export type FormInput =
  TextInput |
  NumberInput |
  AutoCompleteInput<any>

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
