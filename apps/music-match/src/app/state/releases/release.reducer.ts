import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as ReleaseActions from './release.action';
import { ReleaseEntity } from '@music-match/state-entities';

export interface ReleasesState extends EntityState<ReleaseEntity> {
  selectedReleaseId: number;
}

export const adapter = createEntityAdapter<ReleaseEntity>();

export const initialState: ReleasesState = adapter.getInitialState({
  selectedReleaseId: -1,
});

export const releaseReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, { searchResults }) =>
    adapter.upsertMany(
      searchResults.releases.map((release) => {
        return {
          ...release,
          trackIds: [], // release.tracks.map(({ id }) => id),
          artistIds: [], // release.artists.map(({ id }) => id),
        };
      }),
      state
    )
  ),

  on(ReleaseActions.loadedRelease, (state, { release }) => {
    return {
      ...adapter.upsertOne(
        {
          ...release,
          trackIds: release.tracks.map(({ id }) => id),
          artistIds: release.artists.map(({ id }) => id),
        },
        state
      ),
      selectedReleaseId: release.id,
    };
  })
);
