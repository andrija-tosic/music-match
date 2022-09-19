import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ApiError } from '../types';
import { ofType } from '@ngrx/effects';
import * as ArtistActions from '../state/artists/artist.actions';
import { ActionsSubject } from '@ngrx/store';
import * as PlaylistActions from '../state/playlists/playlist.actions';
import * as ReleaseActions from '../state/releases/release.actions';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly snackbarPosition = {
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
  } as MatSnackBarConfig;

  readonly snackbarPositionWith3sDuration = {
    ...this.snackbarPosition,
    duration: 3000,
  } as MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private action$: ActionsSubject) {
    const createdArtistActionSub = this.action$
      .pipe(ofType(ArtistActions.createdArtist))
      .subscribe(() => this.showNotification(`Created artist`));

    const updatedArtistActionSub = this.action$
      .pipe(ofType(ArtistActions.updatedSelectedArtist))
      .subscribe(() => this.showNotification(`Updated artist`));

    const deletedArtistActionSub = this.action$
      .pipe(ofType(ArtistActions.deleteArtist))
      .subscribe(() => {
        this.showNotification(`Deleted artist`);
      });

    const addedTrackActionSub = this.action$
      .pipe(ofType(PlaylistActions.addedTracksToPlaylist))
      .subscribe(() => this.showNotification(`Added track to playlist`));

    const removedTrackActionSub = this.action$
      .pipe(ofType(PlaylistActions.removedTracksFromPlaylist))
      .subscribe(() => this.showNotification(`Removed track from playlist`));

    const addedCollaboratorActionSub = this.action$
      .pipe(ofType(PlaylistActions.addedCollaboratorToPlaylist))
      .subscribe(() => this.showNotification(`Added collaborator`));

    const removedCollaboratorActionSub = this.action$
      .pipe(ofType(PlaylistActions.removedCollaboratorFromPlaylist))
      .subscribe(() => this.showNotification(`Removed collaborator`));

    const createdPlaylistActionSub = this.action$
      .pipe(ofType(PlaylistActions.createPlaylist))
      .subscribe(() => this.showNotification(`Created playlist`));

    const updatedPlaylistActionSub = this.action$
      .pipe(ofType(PlaylistActions.updatedSelectedPlaylist))
      .subscribe(() => this.showNotification(`Updated playlist`));

    const deletedPlaylistActionSub = this.action$
      .pipe(ofType(PlaylistActions.deletePlaylist))
      .subscribe(() => this.showNotification(`Deleted playlist`));

    const createdReleaseActionSub = this.action$
      .pipe(ofType(ReleaseActions.createdRelease))
      .subscribe(() => this.showNotification(`Created release`));

    const updatedReleaseActionSub = this.action$
      .pipe(ofType(ReleaseActions.updatedRelease))
      .subscribe(() => this.showNotification(`Updated release`));

    const deletedReleaseActionSub = this.action$
      .pipe(ofType(ReleaseActions.deleteRelease))
      .subscribe(() => this.showNotification(`Deleted release`));
  }

  showNotification(text: string) {
    this.snackbar.open(text, 'OK', {
      ...this.snackbarPositionWith3sDuration,
    });
  }

  showError(text: string) {
    this.snackbar.open(text, 'OK', {
      ...this.snackbarPositionWith3sDuration,
      panelClass: ['mat-toolbar', 'mat-warn'],
    });
  }

  showApiError(res: ApiError) {
    this.snackbar.open(res.error.message, 'OK', {
      ...this.snackbarPositionWith3sDuration,
      panelClass: ['mat-toolbar', 'mat-warn'],
    });
  }
}
