import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateArtistDto } from '@music-match/entities';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { filter, first, take } from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import * as ArtistActions from '../../state/artists/artist.actions';
import {
  createArtist,
  updateSelectedArtist,
} from '../../state/artists/artist.actions';
import { selectedArtist } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { AbstractFormDialog } from '../abstract-form-dialog/abstract-form.dialog';

@Component({
  selector: 'music-match-artist-form-dialog',
  templateUrl: './artist-form-dialog.component.html',
  styleUrls: ['./artist-form-dialog.component.css'],
})
export class ArtistFormDialogComponent extends AbstractFormDialog<
  ArtistFormDialogComponent,
  CreateArtistDto,
  'Update' | 'Create'
> {
  constructor(
    fileService: FileService,
    store: Store<AppState>,
    dialogRef: MatDialogRef<ArtistFormDialogComponent>,
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
    });

    if (this.actionType === 'Update') {
      this.store
        .select(selectedArtist)
        .pipe(take(1), filter(isNotUndefined))
        .subscribe((artist) => {
          this.imageUrlInForm = artist.imageUrl;
          this.form.get('name')!.patchValue(artist.name);
        });
    }
  }

  getFormValueAndDispatch(): void {
    const { name } = this.form.getRawValue();

    this.dispatchCreateOrUpdateEntity(
      { name, imageUrl: this.imageUrlInForm },
      this.actionType
    );
  }

  navigateIfEntityCreatedOnAction(): void {
    if (this.actionType === 'Create') {
      this.action$
        .pipe(ofType(ArtistActions.createdArtist), first())
        .subscribe(({ artist }) => {
          this.router.navigate(['artist/' + artist.id]);
          this.dialogRef.close();
        });
    } else {
      this.dialogRef.close();
    }
  }
  dispatchCreateOrUpdateEntity(
    entity: CreateArtistDto,
    actionType: 'Update' | 'Create'
  ): void {
    if (actionType === 'Create') {
      this.store.dispatch(createArtist({ artist: entity }));
    } else if (actionType === 'Update') {
      this.store.dispatch(updateSelectedArtist({ artist: entity }));
    }
  }
}
