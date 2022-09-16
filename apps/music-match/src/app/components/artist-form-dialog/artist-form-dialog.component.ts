import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CreateArtistDto } from '@music-match/entities';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, take } from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import {
  createArtist,
  updateSelectedArtist,
} from '../../state/artists/artist.actions';
import { selectedArtist } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';

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
    @Inject(MAT_DIALOG_DATA) public actionType: 'Update' | 'Create'
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

    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
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
    this.dialogRef.close();
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
