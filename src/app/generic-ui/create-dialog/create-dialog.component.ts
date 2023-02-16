import {Component, Inject, OnInit} from '@angular/core'
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog'
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms'
import {formControlForTextInput, NumberInput, TextInput} from './input-text/input-text.component'
import {AutoCompleteInput, formControlForAutocompleteInput} from './input-auto-complete/input-auto-complete.component'
import {combine, FormInput} from './form-input'
import {DateInput, formControlForDateInput} from './input-date/input-date.component'
import {BooleanInput, formControlForBooleanInput} from './input-boolean/input-boolean.component'

export type CreateDialogResult =
  { [attr: string]: string } |
  'cancel'

export interface CreateDialogData {
  objectName: string
  inputs: FormInput[]
}

type DialogType = 'create' | 'update'

@Component({
  selector: 'schd-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  title: string
  buttonTitle: string
  formGroup: UntypedFormGroup = new UntypedFormGroup({})

  private formControlForInput = combine([
    formControlForTextInput,
    formControlForAutocompleteInput,
    formControlForDateInput,
    formControlForBooleanInput
  ])

  static instance = <A>(
    dialog: MatDialog,
    data: CreateDialogData,
    kind: DialogType
  ): MatDialogRef<CreateDialogComponent, CreateDialogResult> =>
    dialog.open<CreateDialogComponent>(
      CreateDialogComponent, {data: [data, kind]}
    )

  constructor(
    private dialogRef: MatDialogRef<CreateDialogComponent, CreateDialogResult>,
    @Inject(MAT_DIALOG_DATA) public payload: [CreateDialogData, DialogType]
  ) {
    const [data, kind] = payload
    this.buttonTitle = kind === 'create' ? 'Erstellen' : 'Aktualisieren'
    this.title = `${data.objectName} ${this.buttonTitle.toLowerCase()}`
    data.inputs.forEach(i => {
      const fc = this.formControlForInput(i)
      if (fc) {
        if (i.disabled) {
          fc.disable()
        }
        this.formGroup.addControl(i.attr, fc)
      }
    })
  }

  ngOnInit(): void {
  }

  data = (): CreateDialogData =>
    this.payload[0]

  cancel = () =>
    this.dialogRef.close('cancel')

  onSubmit = () => {
    if (!this.formGroup.valid) {
      return
    }
    this.dialogRef.close(this.formGroup.value)
  }

  formControl = (attr: string) =>
    this.formGroup.controls[attr] as UntypedFormControl

  asAutocomplete = (i: FormInput) =>
    i as AutoCompleteInput<any>

  asTextInput = (i: FormInput): TextInput | NumberInput =>
    i as TextInput || i as NumberInput

  asDateInput = (i: FormInput): DateInput =>
    i as DateInput

  asBooleanInput = (i: FormInput): BooleanInput =>
    i as BooleanInput
}
