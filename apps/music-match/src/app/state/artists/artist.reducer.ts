import { createReducer, on } from '@ngrx/store';
import { Release, Artist } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as ReleaseActions from '../releases/release.action';

export interface ArtistsState extends EntityState<Artist> {
  selectedArtistId: number;
}

export const adapter = createEntityAdapter<Artist>();

export const initialState: ArtistsState = adapter.getInitialState({
  selectedArtistId: -1,
});

export const artistReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, searchResults) =>
    adapter.upsertMany(searchResults.searchResults.artists, state)
  ),
  on(ReleaseActions.loadedRelease, (state, { release }) =>
    adapter.upsertMany(release.artists, state)
  )
);
