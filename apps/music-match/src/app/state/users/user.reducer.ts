import { createReducer, on } from '@ngrx/store';
import { UserEntity } from '@music-match/state-entities';
import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import * as SearchActions from '../search/search.actions';
import * as UserActions from './user.actions';
import * as PlaylistActions from '../playlists/playlist.actions';

export interface UsersState extends EntityState<UserEntity> {
  selectedUserId: number;
  currentUserId: number;
}

const adapter = createEntityAdapter<UserEntity>();

const initialState: UsersState = adapter.getInitialState({
  selectedUserId: -1,
  currentUserId: -1,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.setCurrentUserId, (state, { id }) => {
    return {
      ...state,
      currentUserId: id,
    };
  }),
  on(UserActions.loadedUser, (state, { user }) => {
    return {
      ...adapter.addMany(
        [
          {
            ...user,
            playlistsIds: user.playlists.map(({ id }) => id),
            likedPlaylistsIds: user.likedPlaylists.map(({ id }) => id),
            friendsIds: user.following.map(({ id }) => id),
          },
          ...user.following.map((friend) => {
            return {
              ...friend,
              likedPlaylistsIds: [],
              playlistsIds: [],
              friendsIds: [],
            };
          }),
          ...user.followers.map((follower) => {
            return {
              ...follower,
              likedPlaylistsIds: [],
              playlistsIds: [],
              friendsIds: [],
            };
          }),
        ],
        state
      ),
      selectedUserId: user.id,
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
  ),
  on(PlaylistActions.createdPlaylist, (state, { playlist }) => {
    const currentUser = state.entities[state.currentUserId]!;

    return adapter.updateOne(
      {
        id: state.currentUserId,
        changes: {
          playlistsIds: [...currentUser.playlistsIds, playlist.id],
        },
      },
      state
    );
  }),
  on(PlaylistActions.deletePlaylist, (state, { id }) => {
    const currentUser = state.entities[state.currentUserId]!;

    return adapter.updateOne(
      {
        id: state.currentUserId,
        changes: {
          playlistsIds: currentUser.playlistsIds.filter((pId) => pId !== id),
        },
      },
      state
    );
  }),
  on(PlaylistActions.loadedPlaylistWithTracks, (state, { playlist }) => {
    if (!playlist) return state;

    const users: Update<UserEntity>[] = playlist.owners.map((user) => {
      return {
        id: user.id,
        changes: {
          name: user.name,
          imageUrl: user.imageUrl,
          role: user.role,
        },
      };
    });

    return adapter.updateMany(users, state);
  })
);
