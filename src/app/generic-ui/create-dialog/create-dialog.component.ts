import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
import {FormControl, FormGroup} from '@angular/forms'
import {formControlForTextInput, NumberInput, TextInput} from './input-text/input-text.component'
import {AutoCompleteInput, formControlForAutocompleteInput} from './input-auto-complete/input-auto-complete.component'

export type CreateDialogResult =
  { [attr: string]: string } |
  'cancel'

export interface CreateDialogData {
  objectName: string
  inputs: FormInput[]
}

export type FormInput =
  TextInput |
  NumberInput |
  AutoCompleteInput<any>

const combine = (
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

@Component({
  selector: 'schd-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  title: string
  formGroup: FormGroup = new FormGroup({})

  private formControlForInput = combine([
    formControlForTextInput,
    formControlForAutocompleteInput
  ])

  static instance = <A>(
    dialog: MatDialog,
    data: CreateDialogData
  ): MatDialogRef<CreateDialogComponent, CreateDialogResult> =>
    dialog.open<CreateDialogComponent>(
      CreateDialogComponent, {data}
    )

  constructor(
    private dialogRef: MatDialogRef<CreateDialogComponent, CreateDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDialogData
  ) {
    this.title = `${data.objectName} erstellen`
    data.inputs.forEach(i => {
      const input = this.formControlForInput(i)
      if (input) {
        this.formGroup.addControl(i.attr, input)
      }
    })
  }

  ngOnInit(): void {
  }

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
}
