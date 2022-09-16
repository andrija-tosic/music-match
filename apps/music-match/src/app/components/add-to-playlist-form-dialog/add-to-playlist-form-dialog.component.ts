import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PlaylistEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app.state';
import { selectCurrentUsersPlaylists } from '../../state/users/user.selectors';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';

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
