import { createReducer, on } from '@ngrx/store';
import { UserEntity } from '@music-match/state-entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as UserActions from './user.action';
import * as PlaylistActions from '../playlists/playlist.action';

export interface UsersState extends EntityState<UserEntity> {
  selectedUserId: number;
  currentUserId: number;
}

export const adapter = createEntityAdapter<UserEntity>();

export const initialState: UsersState = adapter.getInitialState({
  selectedUserId: -1,
  currentUserId: -1,
});

export const userReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, searchResults) =>
    adapter.upsertMany(searchResults.searchResults.users as UserEntity[], state)
  ),
  on(UserActions.currentUserSet, (state, user) => {
    return {
      ...adapter.upsertOne(
        { ...user, likedPlaylistsIds: [], playlistsIds: [], friendsIds: [] },
        state
      ),
      currentUserId: user.id,
    };
  }),
  on(
    PlaylistActions.loadedUserPlaylists,
    (state, { usersPlaylists, usersLikedPlaylists }) =>
      adapter.upsertOne(
        {
          ...state.entities[state.currentUserId]!,
          likedPlaylistsIds: usersLikedPlaylists.map(({ id }) => id),
          playlistsIds: usersPlaylists.map(({ id }) => id),
        },
        state
      )
  )
);
