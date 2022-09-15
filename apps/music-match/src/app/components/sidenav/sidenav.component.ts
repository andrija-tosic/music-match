import { PlaylistFormDialogComponent } from './../playlist-form-dialog/playlist-form-dialog.component';
import { AppState } from './../../app.state';
import {
  selectCurrentUsersPlaylists,
  selectUsersLikedPlaylists,
} from '../../state/users/user.selectors';
import { loadCurrentUserPlaylists } from '../../state/playlists/playlist.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistEntity } from '@music-match/state-entities';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  usersPlaylist$ = new Observable<PlaylistEntity[]>();
  likedPlaylist$ = new Observable<PlaylistEntity[]>();

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(loadCurrentUserPlaylists());
    this.usersPlaylist$ = this.store.select(selectCurrentUsersPlaylists);
    this.likedPlaylist$ = this.store.select(selectUsersLikedPlaylists);
  }

  openPlaylistFormDialog(actionType: string) {
    const dialogRef = this.dialog.open(PlaylistFormDialogComponent, {
      data: actionType,
    });
  }
}
