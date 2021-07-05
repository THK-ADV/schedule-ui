import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
import {FormControl, FormGroup} from '@angular/forms'
import {formControlForTextInput, NumberInput, TextInput} from './input-text/input-text.component'
import {AutoCompleteInput, formControlForAutocompleteInput} from './input-auto-complete/input-auto-complete.component'
import {combine, FormInput} from './form-input'
import {DateInput, formControlForDateInput} from './input-date/input-date.component'

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
  formGroup: FormGroup = new FormGroup({})

  private formControlForInput = combine([
    formControlForTextInput,
    formControlForAutocompleteInput,
    formControlForDateInput
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
    this.formGroup.controls[attr] as FormControl

  asAutocomplete = (i: FormInput) =>
    i as AutoCompleteInput<any>

  asTextInput = (i: FormInput): TextInput | NumberInput =>
    i as TextInput || i as NumberInput

  asDateInput = (i: FormInput): DateInput =>
    i as DateInput
}
