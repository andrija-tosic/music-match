import { ReleaseEntity } from '@music-match/state-entities';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ArtistActions from '../artists/artist.actions';
import * as SearchActions from '../search/search.actions';
import * as ReleaseActions from './release.actions';

export interface ReleasesState extends EntityState<ReleaseEntity> {
  selectedReleaseId: number;
}

const adapter = createEntityAdapter<ReleaseEntity>();

const initialState: ReleasesState = adapter.getInitialState({
  selectedReleaseId: -1,
});

export const releaseReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, { searchResults }) =>
    adapter.addMany(
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
  }),
  on(ArtistActions.loadedArtistWithReleases, (state, { artist }) =>
    adapter.addMany(
      artist.releases.map((release) => {
        return {
          ...release,
          artistIds: [artist.id], // release.artists?.map(({ id }) => id),
          trackIds: [], // release.tracks?.map(({ id }) => id),
        };
      }),
      state
    )
  ),
  on(ReleaseActions.updatedRelease, (state, { release }) => {
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
