import {MatDialog, MatDialogRef} from '@angular/material/dialog'
import {EMPTY, Observable} from 'rxjs'
import {switchMap} from 'rxjs/operators'
import {DeleteDialogComponent, DeleteDialogData} from './delete-dialog/delete-dialog.component'

export type BinaryDialogResult = 'ok' | 'cancel'

export const openDialog = <T, R, U>(
  dialogRef: MatDialogRef<T, R>,
  andThen: (e: R) => Observable<U>
) =>
  dialogRef.afterClosed().pipe(switchMap(x => x !== undefined ? andThen(x) : EMPTY))

export const openDeleteDialog = <A>(
  dialog: MatDialog,
  data: DeleteDialogData,
  ok: () => Observable<A>,
) =>
  openDialog(DeleteDialogComponent.instance(dialog, data), res => {
    switch (res) {
      case 'ok':
        return ok()
      case 'cancel':
        return EMPTY
    }
  })
