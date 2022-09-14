import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as Actions from './search.action';
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
  on(Actions.queriedSearch, (state, payload) => {
    console.log(payload);

    return {
      ...adapter.upsertOne(
        {
          query: payload.searchResults.query,
          artistIds: payload.searchResults.users.map(({ id }) => id),
          releaseIds: payload.searchResults.releases.map(({ id }) => id),
          trackIds: payload.searchResults.tracks.map(({ id }) => id),
          userIds: payload.searchResults.users.map(({ id }) => id),
          playlistIds: payload.searchResults.playlists.map(({ id }) => id),
        },
        state
      ),
      latestQuery: payload.searchResults.query,
    };
  })
);
