import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, filter, first, take } from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import * as PlaylistActions from '../../state/playlists/playlist.actions';
import {
  createPlaylist,
  updateSelectedPlaylist,
} from '../../state/playlists/playlist.actions';
import { selectedPlaylist } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';
import { SnackbarService } from '../../services/snackbar.service';
import { ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  selector: 'playlist-form-dialog',
  templateUrl: './playlist-form-dialog.component.html',
  styleUrls: ['./playlist-form-dialog.component.css'],
})
export class PlaylistFormDialogComponent {
  public form;
  imageUrl: string = '';
  imageFile: any = undefined;
  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public actionType: 'Update' | 'Create',
    private fileService: FileService,
    private store: Store<AppState>,
    private snackbar: SnackbarService,
    private action$: ActionsSubject,
    private router: Router
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
      }),
    });

    if (this.actionType === 'Update') {
      this.store
        .select(selectedPlaylist)
        .pipe(filter(isNotUndefined), take(1))
        .subscribe((playlist) => {
          this.imageUrl = playlist.imageUrl;
          this.form.get('name')!.patchValue(playlist.name);
          this.form.get('description')!.patchValue(playlist.description);
        });
    }
  }

  removeImage() {
    this.imageUrl = '';
  }

  onFileChanged(event: any) {
    this.imageFile = event.target.files[0];

    this.fileService.readFile(this.imageFile).subscribe({
      next: (url) => {
        this.imageUrl = url;
      },
      error: (msg) => {
        this.snackbar.showError(msg);
      },
    });
  }

  onConfirm(): void {
    this.uploading$.next(true);
    this.dialogRef.disableClose = true;

    const { name, description } = this.form.getRawValue();

    if (this.imageFile && this.imageUrl !== '') {
      this.fileService.uploadImage(this.imageFile).subscribe((newImageUrl) => {
        this.uploading$.next(false);

        this.imageUrl = newImageUrl;

        this.dispatchCreateOrUpdatePlaylist(
          name,
          description,
          this.imageUrl,
          this.actionType
        );
      });
    } else {
      this.dispatchCreateOrUpdatePlaylist(
        name,
        description,
        this.imageUrl,
        this.actionType
      );
    }

    this.uploading$.next(false);
    this.dialogRef.disableClose = false;

    if (this.actionType === 'Create') {
      this.action$
        .pipe(ofType(PlaylistActions.createdPlaylist), first())
        .subscribe(({ playlist }) => {
          this.router.navigate(['playlist/' + playlist.id]);
          this.dialogRef.close();
        });
    } else {
      this.dialogRef.close();
    }
  }

  dispatchCreateOrUpdatePlaylist(
    name: string,
    description: string,
    newImageUrl: string,
    action: 'Create' | 'Update'
  ) {
    if (action === 'Create') {
      this.store.dispatch(
        createPlaylist({
          playlist: {
            name,
            description,
            imageUrl: newImageUrl,
          },
        })
      );
    } else if (action === 'Update') {
      this.store.dispatch(
        updateSelectedPlaylist({
          playlist: {
            name,
            description,
            imageUrl: newImageUrl,
          },
        })
      );
    }
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }
}
