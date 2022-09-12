import { PlaylistFormDialogComponent } from './../playlist-form-dialog/playlist-form-dialog.component';
import { AppState } from './../../app.state';
import {
  selectUsersPlaylists,
  selectUsersLikedPlaylists,
} from './../../state/users/user.selector';
import {
  loadUserPlaylists,
  loadCurrentUserPlaylists,
} from './../../state/playlists/playlist.action';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistEntity } from '@music-match/state-entities';

@Component({
  selector: 'music-match-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  usersPlaylist$ = new Observable<PlaylistEntity[]>();
  likedPlaylist$ = new Observable<PlaylistEntity[]>();

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(loadCurrentUserPlaylists());
    this.usersPlaylist$ = this.store.select(selectUsersPlaylists);
    this.likedPlaylist$ = this.store.select(selectUsersLikedPlaylists);
  }

  openPlaylistFormDialog(actionType: string) {
    const dialogRef = this.dialog.open(PlaylistFormDialogComponent, {
      data: actionType,
    });
  }
}
