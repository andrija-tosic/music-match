import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { filter, map, Observable, shareReplay } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  selectCurrentUser,
  selectCurrentUsersFriends,
  selectCurrentUsersLikedPlaylists,
  selectCurrentUsersPlaylists,
} from '../../state/users/user.selectors';
import { isNotUndefined } from '../../type-guards';
import { ArtistFormDialogComponent } from '../artist-form-dialog/artist-form-dialog.component';
import { AppState } from '../../app.state';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  @ViewChild('sideNav') sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe('(max-width: 800px)')
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  usersPlaylist$: Observable<PlaylistEntity[]>;
  likedPlaylist$: Observable<PlaylistEntity[]>;
  friends$: Observable<UserEntity[]>;
  currentUser$: Observable<UserEntity>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.usersPlaylist$ = this.store.select(selectCurrentUsersPlaylists);
    this.likedPlaylist$ = this.store.select(selectCurrentUsersLikedPlaylists);

    this.friends$ = this.store
      .select(selectCurrentUsersFriends)
      .pipe(filter(isNotUndefined));

    this.currentUser$ = this.store
      .select(selectCurrentUser)
      .pipe(filter(isNotUndefined));
  }

  openPlaylistFormDialog(actionType: string) {
    this.dialog.open(PlaylistFormDialogComponent, {
      data: actionType,
    });
  }

  openArtistFormDialog(actionType: string) {
    this.dialog.open(ArtistFormDialogComponent, {
      data: actionType,
    });
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
