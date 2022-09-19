import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateArtistDto } from '@music-match/entities';
import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, filter, first, take } from 'rxjs';
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
import { ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  selector: 'music-match-artist-form-dialog',
  templateUrl: './artist-form-dialog.component.html',
  styleUrls: ['./artist-form-dialog.component.css'],
})
export class ArtistFormDialogComponent {
  imageUrl: string = '';
  imageFile: any = undefined;

  public form;

  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fileService: FileService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ArtistFormDialogComponent>,
    private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public actionType: 'Update' | 'Create',
    private action$: ActionsSubject,
    private router: Router
  ) {
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
          this.imageUrl = artist.imageUrl;
          this.form.get('name')!.patchValue(artist.name);
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

    const { name } = this.form.getRawValue();

    if (this.imageFile && this.imageUrl !== '') {
      this.fileService.uploadImage(this.imageFile).subscribe((newImageUrl) => {
        this.uploading$.next(false);

        this.imageUrl = newImageUrl;

        this.dispatchCreateOrUpdateArtist(
          { name, imageUrl: this.imageUrl },
          this.actionType
        );
      });
    } else {
      this.dispatchCreateOrUpdateArtist(
        { name, imageUrl: this.imageUrl },
        this.actionType
      );
    }

    this.uploading$.next(false);
    this.dialogRef.disableClose = false;

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

  dispatchCreateOrUpdateArtist(
    artist: CreateArtistDto,
    actionType: 'Create' | 'Update'
  ) {
    if (actionType === 'Create') {
      this.store.dispatch(createArtist({ artist }));
    } else if (actionType === 'Update') {
      this.store.dispatch(updateSelectedArtist({ artist }));
    }
  }

  onDismiss(): void {
    this.dialogRef.close();
  }
}
