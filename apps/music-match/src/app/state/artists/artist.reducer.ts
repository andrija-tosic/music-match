import { createReducer, on } from '@ngrx/store';
import { Release, Artist } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.actions';
import * as ReleaseActions from '../releases/release.actions';
import * as UserCompatibilityActions from '../user-compatibility/user-compatibility.actions';
import * as ArtistActions from './artist.actions';
import { ArtistEntity } from '@music-match/state-entities';

export interface ArtistsState extends EntityState<ArtistEntity> {
  selectedArtistId: number;
}

const adapter = createEntityAdapter<ArtistEntity>();

const initialState: ArtistsState = adapter.getInitialState({
  selectedArtistId: -1,
});

export const artistReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, searchResults) =>
    adapter.addMany(
      searchResults.searchResults.artists.map((artist) => {
        return {
          ...artist,
          releaseIds: [],
        };
      }),
      state
    )
  ),
  on(ReleaseActions.loadedRelease, (state, { release }) =>
    adapter.upsertMany(release.artists, state)
  ),
  on(
    UserCompatibilityActions.usersCompatibilityLoaded,
    (state, { userCompatibility }) =>
      adapter.addMany(
        userCompatibility.artistResults.map((artist) => {
          return {
            id: artist.id,
            name: artist.name,
            imageUrl: artist.imageUrl,
            releaseIds: [],
          };
        }),
        state
      )
  ),
  on(ArtistActions.loadedArtistWithReleases, (state, { artist }) => {
    return {
      ...adapter.upsertOne(
        { ...artist, releaseIds: artist.releases.map(({ id }) => id) },
        state
      ),
      selectedArtistId: artist.id,
    };
  }),
  on(ArtistActions.createdArtist, (state, { artist }) =>
    adapter.addOne(
      {
        ...artist,
        releaseIds: [],
      },
      state
    )
  ),
  on(ArtistActions.updatedSelectedArtist, (state, { artist }) =>
    adapter.upsertOne(
      {
        ...artist,
        releaseIds: artist.releases.map(({ id }) => id),
      },
      state
    )
  ),
  on(ArtistActions.deleteArtist, (state, { id }) =>
    adapter.removeOne(id, state)
  )
);
