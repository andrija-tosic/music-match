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

export const usersAdapter = createEntityAdapter<UserEntity>();

export const initialState: UsersState = usersAdapter.getInitialState({
  selectedUserId: -1,
  currentUserId: -1,
});

export const userReducer = createReducer(
  initialState,
  on(SearchActions.querySearchSuccess, (state, searchResults) =>
    usersAdapter.upsertMany(
      searchResults.searchResults.users as UserEntity[],
      state
    )
  ),
  on(UserActions.setCurrentUserSuccess, (state, user) => {
    return {
      ...usersAdapter.upsertOne(
        { ...user, likedPlaylistsIds: [], playlistsIds: [] },
        state
      ),
      currentUserId: user.id,
    };
  }),
  on(
    PlaylistActions.loadUserPlaylistsSuccess,
    (state, { usersPlaylists, usersLikedPlaylists }) =>
      usersAdapter.upsertOne(
        {
          ...state.entities[state.currentUserId]!,
          likedPlaylistsIds: usersLikedPlaylists.map(({ id }) => id),
          playlistsIds: usersPlaylists.map(({ id }) => id),
        },
        state
      )
  )
);
