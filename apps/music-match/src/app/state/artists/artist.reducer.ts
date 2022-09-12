import { createReducer, on } from '@ngrx/store';
import { Release, Artist } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as ReleaseActions from '../releases/release.action';

export interface ArtistsState extends EntityState<Artist> {
  selectedArtistId: number;
}

export const artistAdapter = createEntityAdapter<Artist>();

export const initialState: ArtistsState = artistAdapter.getInitialState({
  selectedArtistId: -1,
});

export const artistReducer = createReducer(
  initialState,
  on(SearchActions.querySearchSuccess, (state, searchResults) =>
    artistAdapter.upsertMany(searchResults.searchResults.artists, state)
  ),
  on(ReleaseActions.loadReleaseSuccess, (state, { release }) =>
    artistAdapter.upsertMany(release.artists, state)
  )
);
