import { selectTracksByIds } from '../tracks/track.selectors';
import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectPlaylists = createSelector(
  (state: AppState) => state.playlists,
  (playlists) => playlists
);

export const selectPlaylistsByIds = (ids: number[]) =>
  createSelector(selectPlaylists, (playlists) =>
    ids.map((id) => playlists.entities[id]!)
  );
