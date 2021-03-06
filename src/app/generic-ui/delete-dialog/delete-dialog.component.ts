import {Component, Inject, OnInit} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog'
import {BinaryDialogResult} from '../dialog-opener'

export interface DeleteDialogData {
  label: string
}

@Component({
  selector: 'schd-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  content: string

  static instance = (
    dialog: MatDialog,
    data: DeleteDialogData
  ): MatDialogRef<DeleteDialogComponent, BinaryDialogResult> =>
    dialog.open<DeleteDialogComponent, DeleteDialogData, BinaryDialogResult>(
      DeleteDialogComponent, {data}
    )

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent, BinaryDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {
    this.content = `Soll ${data.label} gelöscht werden?`
  }

  ngOnInit(): void {
  }

  cancel = () =>
    this.dialogRef.close('cancel')

  delete = () =>
    this.dialogRef.close('ok')
}
