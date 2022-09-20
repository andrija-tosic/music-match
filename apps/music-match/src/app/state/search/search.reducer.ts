import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as Actions from './search.actions';
import { SearchEntity } from '@music-match/state-entities';

export interface SearchState extends EntityState<SearchEntity> {
  latestQuery: string;
}

const adapter = createEntityAdapter<SearchEntity>({
  selectId: (entity: SearchEntity) => entity.query,
});

const initialState: SearchState = adapter.getInitialState({
  latestQuery: '',
});

export const searchReducer = createReducer(
  initialState,
  on(Actions.queriedSearch, (state, payload) =>
    adapter.upsertOne(
      {
        query: payload.searchResults.query,
        artistIds: payload.searchResults.artists.map(({ id }) => id),
        releaseIds: payload.searchResults.releases.map(({ id }) => id),
        trackIds: payload.searchResults.tracks.map(({ id }) => id),
        userIds: payload.searchResults.users.map(({ id }) => id),
        playlistIds: payload.searchResults.playlists.map(({ id }) => id),
      },
      { ...state, latestQuery: payload.searchResults.query }
    )
  )
);
