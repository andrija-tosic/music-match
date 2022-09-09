import { ApiError } from './types/api-error.type';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

export const constants = {
  snackbarPosition: {
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
  } as MatSnackBarConfig<any>,

  httpOptions: {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  },
};

export function snackbarError(snackbar: MatSnackBar, res: ApiError) {
  snackbar.open(res.error.message, '', {
    ...constants.snackbarPosition,
    duration: 3000,
    panelClass: ['mat-toolbar', 'mat-warn'],
  });
}
