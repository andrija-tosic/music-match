import { selectedPlaylist } from '../selectors';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { filter, first, map, switchMap, tap } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import * as PlaylistActions from './playlist.actions';
import { AppState } from '../../app.state';
import { isNotUndefined } from '../../type-guards';
import { Router } from '@angular/router';

@Injectable()
export class PlaylistsEffects {
  constructor(
    private action$: Actions,
    private playlistService: PlaylistService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  loadCurrentUserPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.loadCurrentUserPlaylists),
      switchMap(() =>
        this.playlistService.getCurrentUserPlaylists().pipe(
          map(({ playlists, likedPlaylists }) =>
            PlaylistActions.loadedUserPlaylists({
              usersPlaylists: playlists,
              usersLikedPlaylists: likedPlaylists,
            })
          )
        )
      )
    )
  );

  loadPlaylistWithTracks$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.loadPlaylistWithTracks),
      switchMap(({ id }) =>
        this.playlistService
          .getPlaylist(id)
          .pipe(
            map((playlist) =>
              PlaylistActions.loadedPlaylistWithTracks({ playlist })
            )
          )
      )
    )
  );

  createPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.createPlaylist),
      switchMap(({ playlist }) =>
        this.playlistService
          .createPlaylist(playlist)
          .pipe(
            map((playlist) => PlaylistActions.createdPlaylist({ playlist }))
          )
      )
    )
  );

  navigateToCreatedPlaylist$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(PlaylistActions.createdPlaylist),
        tap(({ playlist }) =>
          this.router.navigate(['/playlist/' + playlist.id])
        )
      ),
    { dispatch: false }
  );

  updateSelectedPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.updateSelectedPlaylist),
      switchMap(({ playlist }) =>
        this.store.select(selectedPlaylist).pipe(
          filter(isNotUndefined),
          first(),
          switchMap((oldPlaylist) =>
            this.playlistService
              .updatePlaylist(oldPlaylist.id, playlist)
              .pipe(
                map((playlist) =>
                  PlaylistActions.updatedSelectedPlaylist({ playlist })
                )
              )
          )
        )
      )
    )
  );

  deletePlaylist$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(PlaylistActions.deletePlaylist),
        switchMap(({ id }) =>
          this.playlistService
            .deletePlaylist(id)
            .pipe(map(() => PlaylistActions.deletedPlaylist()))
        )
      ),
    { dispatch: false }
  );

  addTracksToPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.addTracksToPlaylist),
      switchMap(({ id, tracksDto }) =>
        this.playlistService
          .addTracks(id, tracksDto)
          .pipe(
            map((tracks) => PlaylistActions.addedTracksToPlaylist({ tracks }))
          )
      )
    )
  );

  removeTracksFromPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.removeTracksFromPlaylist),
      switchMap(({ id, removeTrackDto: tracksDto }) =>
        this.playlistService
          .removeTracks(id, tracksDto)
          .pipe(
            map((tracks) =>
              PlaylistActions.removedTracksFromPlaylist({ tracks })
            )
          )
      )
    )
  );

  changeTrackPosition$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.changeTrackPosition),
      switchMap(({ fromIndex, toIndex, playlistId }) =>
        this.playlistService
          .changeTrackPosition(playlistId, fromIndex, toIndex)
          .pipe(map((tracks) => PlaylistActions.changedTrackPosition()))
      )
    )
  );

  addCollaboratorToPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.addCollaboratorToPlaylist),
      switchMap(({ playlistId, userId }) =>
        this.playlistService.addCollaborator(playlistId, userId).pipe(
          map((playlist) =>
            PlaylistActions.addedCollaboratorToPlaylist({
              playlist,
            })
          )
        )
      )
    )
  );

  removeCollaboratorFromPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.removeCollaboratorFromPlaylist),
      switchMap(({ playlistId, userId }) =>
        this.playlistService
          .removeCollaborator(playlistId, userId)
          .pipe(map(() => PlaylistActions.removedCollaboratorFromPlaylist()))
      )
    )
  );
}
