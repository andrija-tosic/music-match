import { selectedPlaylist } from '../selectors';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { filter, first, map, switchMap } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import * as PlaylistActions from './playlist.action';
import { AppState } from '../../app.state';
import { isNotUndefined } from '../../type-guards';

@Injectable()
export class PlaylistsEffects {
  constructor(
    private action$: Actions,
    private playlistService: PlaylistService,
    private store: Store<AppState>
  ) {}
  loadUserPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.loadUserPlaylists),
      switchMap(({ id }) =>
        this.playlistService.getUserPlaylists(id).pipe(
          map(({ playlists, likedPlaylists }) =>
            PlaylistActions.loadUserPlaylistsSuccess({
              usersPlaylists: playlists,
              usersLikedPlaylists: likedPlaylists,
            })
          )
        )
      )
    )
  );

  loadCurrentUserPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.loadCurrentUserPlaylists),
      switchMap(() =>
        this.playlistService.getCurrentUserPlaylists().pipe(
          map(({ playlists, likedPlaylists }) =>
            PlaylistActions.loadUserPlaylistsSuccess({
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
              PlaylistActions.loadPlaylistWithTracksSuccess({ playlist })
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
            map((playlist) =>
              PlaylistActions.createPlaylistSuccess({ playlist })
            )
          )
      )
    )
  );

  updatePlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.updateSelectedPlaylist),
      switchMap(({ playlist }) =>
        this.store.select(selectedPlaylist).pipe(
          first(),
          filter(isNotUndefined),
          switchMap((oldPlaylist) =>
            this.playlistService
              .updatePlaylist(oldPlaylist.id, playlist)
              .pipe(
                map((playlist) =>
                  PlaylistActions.updateSelectedPlaylistSuccess({ playlist })
                )
              )
          )
        )
      )
    )
  );

  deletePlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.deletePlaylist),
      switchMap(({ id }) =>
        this.playlistService
          .deletePlaylist(id)
          .pipe(map(() => PlaylistActions.deletePlaylistSuccess()))
      )
    )
  );

  addTracksToPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.addTracksToPlaylist),
      switchMap(({ id, tracksDto }) =>
        this.playlistService
          .addTracks(id, tracksDto)
          .pipe(
            map((tracks) =>
              PlaylistActions.addTracksToPlaylistSuccess({ tracks })
            )
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
              PlaylistActions.removeTracksFromPlaylistSuccess({ tracks })
            )
          )
      )
    )
  );
}
