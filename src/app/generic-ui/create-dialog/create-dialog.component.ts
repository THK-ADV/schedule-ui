import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
import {FormControl, FormGroup, Validators} from '@angular/forms'

export type CreateDialogResult =
  { [attr: string]: string } |
  'cancel'

export interface CreateDialogData {
  objectName: string
  inputs: Input[]
}

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

export type Input =
  TextInput |
  NumberInput

const formControlForInput = (i: Input): FormControl => {
  switch (i.kind) {
    case 'text':
      return new FormControl(undefined, Validators.required)
    case 'number':
      const validators = [Validators.required, Validators.min(i.min)]
      if (i.max) {
        validators.push(Validators.max(i.max))
      }
      return new FormControl(undefined, validators)
  }
}

@Component({
  selector: 'schd-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  title: string
  formGroup: FormGroup

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
    this.formGroup = new FormGroup({})

    data.inputs.forEach(i => {
      this.formGroup.addControl(i.attr, formControlForInput(i))
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
}
