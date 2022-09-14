import { createPlaylist } from './../../state/playlists/playlist.action';
import { selectedPlaylist } from '../../state/selectors';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, filter, take } from 'rxjs';
import { FileService } from '../../services/file.service';
import { AppState } from '../../app.state';
import { updateSelectedPlaylist } from '../../state/playlists/playlist.action';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'playlist-form-dialog',
  templateUrl: './playlist-form-dialog.component.html',
  styleUrls: ['./playlist-form-dialog.component.css'],
})
export class PlaylistFormDialogComponent {
  form;

  constructor(
    public dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public actionType: 'Update' | 'Create',
    private fileService: FileService,
    private store: Store<AppState>
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
        .pipe(take(1), filter(isNotUndefined))
        .subscribe((playlist) => {
          this.imageUrl = playlist.imageUrl;
          this.form.get('name')!.patchValue(playlist.name);
          this.form.get('description')!.patchValue(playlist.description);
        });
    }
  }

  imageUrl: string = '';
  imageFile: any = undefined;

  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

    const { name, description } = this.form.getRawValue();

    if (this.imageFile && this.imageUrl !== '') {
      this.fileService.uploadImage(this.imageFile).subscribe((newImageUrl) => {
        this.uploading$.next(false);

        this.imageUrl = newImageUrl;

        this.dispatchPlaylistAction(
          name,
          description,
          this.imageUrl,
          this.actionType
        );
      });
    } else {
      this.dispatchPlaylistAction(
        name,
        description,
        this.imageUrl,
        this.actionType
      );
    }

    this.uploading$.next(false);
    this.dialogRef.disableClose = false;
    this.dialogRef.close();
  }

  dispatchPlaylistAction(
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
