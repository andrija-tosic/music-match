import { TrackDto } from '@music-match/entities';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import {
  selectCurrentUsersFriends,
  selectCurrentUsersPlaylists,
} from '../../state/users/user.selectors';
import { filter, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';
import { AppState } from '../../app.state';

@Component({
  selector: 'music-match-add-to-playlist-form-dialog',
  templateUrl: './add-to-playlist-form-dialog.component.html',
  styleUrls: ['./add-to-playlist-form-dialog.component.css'],
})
export class AddToPlaylistFormDialogComponent {
  playlist$: Observable<PlaylistEntity[]>;

  constructor(
    public dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    private store: Store<AppState>
  ) {
    this.playlist$ = this.store.select(selectCurrentUsersPlaylists);
  }

  addToPlaylist(playlist: PlaylistEntity) {
    this.dialogRef.close(playlist);
  }
}
