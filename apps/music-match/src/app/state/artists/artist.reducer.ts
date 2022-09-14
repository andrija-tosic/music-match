import { createReducer, on } from '@ngrx/store';
import { Release, Artist } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as ReleaseActions from '../releases/release.action';
import * as UserCompatibilityActions from '../user-compatibility/user-compatibility.actions';

export interface ArtistsState extends EntityState<Artist> {
  selectedArtistId: number;
}

const adapter = createEntityAdapter<Artist>();

const initialState: ArtistsState = adapter.getInitialState({
  selectedArtistId: -1,
});

export const artistReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, searchResults) =>
    adapter.upsertMany(searchResults.searchResults.artists, state)
  ),
  on(ReleaseActions.loadedRelease, (state, { release }) =>
    adapter.upsertMany(release.artists, state)
  ),
  on(
    UserCompatibilityActions.usersCompatibilityLoaded,
    (state, { userCompatibility }) =>
      adapter.upsertMany(
        userCompatibility.artistResults.map((result) => {
          return {
            id: result.id,
            name: result.name,
            imageUrl: result.imageUrl,
            releases: [],
          };
        }),
        state
      )
  )
);
