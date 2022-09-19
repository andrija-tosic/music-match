import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, first, map, switchMap } from 'rxjs';
import { AppState } from '../../app.state';
import { PlaylistService } from '../../services/playlist.service';
import { isNotUndefined } from '../../type-guards';
import { selectedPlaylist } from '../selectors';
import * as PlaylistActions from './playlist.actions';

@Injectable()
export class PlaylistsEffects {
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
  toggleLike$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.togglePlaylistLike),
      switchMap(({ id }) =>
        this.playlistService
          .toggleLike(id)
          .pipe(map(() => PlaylistActions.toggledPlaylistLike()))
      )
    )
  );

  constructor(
    private action$: Actions,
    private playlistService: PlaylistService,
    private store: Store<AppState>,
    private router: Router
  ) {}
}
