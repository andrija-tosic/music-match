import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import * as PlaylistActions from './playlist.action';

@Injectable()
export class PlaylistsEffects {
  constructor(private action$: Actions, private playlistService: PlaylistService) {}
  loadUserPlaylist$ = createEffect(() =>
    this.action$.pipe(
      ofType(PlaylistActions.loadUserPlaylists),
      switchMap(() =>
        this.playlistService.getUserPlaylists().pipe(
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
          .pipe(map((playlist) => PlaylistActions.loadPlaylistWithTracksSuccess(playlist)))
      )
    )
  );
}
