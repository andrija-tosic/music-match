import { TrackDto } from '@music-match/entities';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import {
  selectCurrentUsersFriends,
  selectCurrentUsersPlaylists,
} from './../../state/users/user.selector';
import { filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';
import { AppState } from '../../app.state';
import { addTracksToPlaylist } from '../../state/playlists/playlist.action';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'music-match-add-to-playlist-form-dialog',
  templateUrl: './add-to-playlist-form-dialog.component.html',
  styleUrls: ['./add-to-playlist-form-dialog.component.css'],
})
export class AddToPlaylistFormDialogComponent {
  playlist$: Observable<PlaylistEntity[]>;
  friend$: Observable<UserEntity[]>;

  constructor(
    public dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public track: TrackDto,
    private store: Store<AppState>
  ) {
    this.playlist$ = this.store.select(selectCurrentUsersPlaylists);

    this.friend$ = this.store
      .select(selectCurrentUsersFriends)
      .pipe(filter(isNotUndefined));
  }

  addToPlaylist(playlist: PlaylistEntity) {
    this.store.dispatch(
      addTracksToPlaylist({
        id: playlist.id,
        tracksDto: { trackId: this.track.id },
      })
    );

    this.dialogRef.close();
  }

  addCollaboratorToPlaylist(friend: UserEntity) {
    this.dialogRef.close();
  }
}
