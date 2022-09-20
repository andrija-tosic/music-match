import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatePlaylistDto } from '@music-match/entities';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { filter, first, take } from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import { SnackbarService } from '../../services/snackbar.service';
import * as PlaylistActions from '../../state/playlists/playlist.actions';
import {
  createPlaylist,
  updateSelectedPlaylist,
} from '../../state/playlists/playlist.actions';
import { selectedPlaylist } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';
import { AbstractFormDialog } from '../abstract-form-dialog/abstract-form.dialog';

@Component({
  selector: 'playlist-form-dialog',
  templateUrl: './playlist-form-dialog.component.html',
  styleUrls: ['./playlist-form-dialog.component.css'],
})
export class PlaylistFormDialogComponent extends AbstractFormDialog<
  PlaylistFormDialogComponent,
  CreatePlaylistDto,
  'Update' | 'Create'
> {
  constructor(
    fileService: FileService,
    store: Store<AppState>,
    dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public actionType: 'Update' | 'Create',
    private action$: ActionsSubject,
    private router: Router
  ) {
    super(fileService, store, dialogRef, snackbar, actionType);
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
          this.imageUrlInForm = playlist.imageUrl;
          this.form.get('name')!.patchValue(playlist.name);
          this.form.get('description')!.patchValue(playlist.description);
        });
    }
  }

  getFormValueAndDispatch(): void {
    const { name, description } = this.form.getRawValue();

    this.dispatchCreateOrUpdateEntity(
      {
        name,
        description,
        imageUrl: this.imageUrlInForm,
      },
      this.actionType
    );
  }

  navigateIfEntityCreatedOnAction(): void {
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

  dispatchCreateOrUpdateEntity(
    entity: CreatePlaylistDto,
    actionType: 'Update' | 'Create'
  ): void {
    if (actionType === 'Create') {
      this.store.dispatch(
        createPlaylist({
          playlist: entity,
        })
      );
    } else if (actionType === 'Update') {
      this.store.dispatch(updateSelectedPlaylist({ playlist: entity }));
    }
  }
}
