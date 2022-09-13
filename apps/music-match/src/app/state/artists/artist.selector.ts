import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectArtists = createSelector(
  (state: AppState) => state.artists,
  (artists) => artists
);

export const selectArtistsByIds = (ids: number[]) =>
  createSelector(selectArtists, (artists) =>
    ids.map((id) => artists.entities[id])
  );
