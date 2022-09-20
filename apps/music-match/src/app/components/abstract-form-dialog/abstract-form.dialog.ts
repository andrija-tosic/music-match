import { Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FileService } from '../../services/file.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { FormGroup } from '@angular/forms';

export abstract class AbstractFormDialog<
  FormDialogComponent,
  EntityType,
  DialogDataType
> {
  imageUrlInForm: string = '';
  imageFileInForm: any = undefined;

  public form: FormGroup;

  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected constructor(
    protected fileService: FileService,
    protected store: Store<AppState>,
    protected dialogRef: MatDialogRef<FormDialogComponent>,
    private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataType
  ) {}

  abstract getFormValueAndDispatch(): void;

  abstract navigateIfEntityCreatedOnAction(): void;

  abstract dispatchCreateOrUpdateEntity(
    entity: EntityType,
    actionType: 'Create' | 'Update'
  ): void;

  onConfirm() {
    this.form.markAllAsTouched();

    this.uploading$.next(true);
    this.dialogRef.disableClose = true;

    this.uploadImageIfExists().subscribe((url) => {
      this.imageUrlInForm = url;

      this.getFormValueAndDispatch();

      this.uploading$.next(false);
      this.dialogRef.disableClose = false;

      this.navigateIfEntityCreatedOnAction();
    });
  }

  onDismiss() {
    this.dialogRef.close(null);
  }

  removeImage() {
    this.imageFileInForm = undefined;
    this.imageUrlInForm = '';
  }

  onFileChanged(event: any) {
    this.imageFileInForm = event.target.files[0];

    this.fileService.readFile(this.imageFileInForm).subscribe({
      next: (url) => {
        this.imageUrlInForm = url;
      },
      error: (msg) => {
        this.snackbar.showError(msg);
      },
    });
  }

  private uploadImageIfExists(): Observable<string> {
    if (this.imageFileInForm && this.imageUrlInForm !== '') {
      return this.fileService.uploadImage(this.imageFileInForm);
    } else {
      return of('');
    }
  }
}
