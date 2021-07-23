import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms'

export const invalidChoiceKey = 'invalidObject'

export const isUserInput = (value: any): boolean =>
  typeof value === 'string'

const isJSON = (value: any): boolean =>
  !isUserInput(value)

export function mandatoryOptionsValidator(): ValidatorFn {
  return (ctl: AbstractControl): ValidationErrors | null => {
    if (!isJSON(ctl.value) || ctl.value === null || ctl.value === '') {
      return {[invalidChoiceKey]: 'Invalide Auswahl'}
    }

    return null
  }
}

export function optionalOptionsValidator(): ValidatorFn {
  return (ctl: AbstractControl): ValidationErrors | null => {
    if (ctl.value === '' || isJSON(ctl.value)) {
      return null
    }

    return {[invalidChoiceKey]: 'Invalide Auswahl'}
  }
}
