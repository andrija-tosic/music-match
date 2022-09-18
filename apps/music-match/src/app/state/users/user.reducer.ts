import { UserEntity } from '@music-match/state-entities';
import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PlaylistActions from '../playlists/playlist.actions';
import * as UserActions from './user.actions';

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
  on(UserActions.loadedUser, (state, { user }) =>
    adapter.upsertMany(
      [
        {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
          role: user.role,
          playlistsIds: user.playlists.map(({ id }) => id),
          likedPlaylistsIds: user.likedPlaylists.map(({ id }) => id),
          friendsIds: user.following.map(({ id }) => id),
        },
        ...user.following.map((friend) => {
          return {
            id: friend.id,
            name: friend.name,
            imageUrl: friend.imageUrl,
            role: friend.role,
            playlistsIds: friend.playlists.map(({ id }) => id),
            likedPlaylistsIds: friend.likedPlaylists.map(({ id }) => id),
            friendsIds: friend.following.map(({ id }) => id),
          };
        }),
        ...user.followers.map((follower) => {
          return {
            id: follower.id,
            name: follower.name,
            imageUrl: follower.imageUrl,
            role: follower.role,
            playlistsIds: follower.playlists.map(({ id }) => id),
            likedPlaylistsIds: follower.likedPlaylists.map(({ id }) => id),
            friendsIds: follower.following.map(({ id }) => id),
          };
        }),
      ],
      { ...state, selectedUserId: user.id }
    )
  ),
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
  }),
  on(PlaylistActions.togglePlaylistLike, (state, { id }) => {
    const user = state.entities[state.currentUserId]!;

    let newLikedPlaylistsIds;

    if (user.likedPlaylistsIds.includes(id)) {
      newLikedPlaylistsIds = user.likedPlaylistsIds.filter(
        (playlistId) => playlistId !== id
      );
    } else {
      newLikedPlaylistsIds = [...user.likedPlaylistsIds, id];
    }

    return adapter.updateOne(
      {
        id: state.currentUserId,
        changes: {
          likedPlaylistsIds: newLikedPlaylistsIds,
        },
      },
      state
    );
  }),
  on(UserActions.toggleUserFollowing, (state, { id }) => {
    const user = state.entities[state.currentUserId]!;

    let newUserFriendsIds;

    if (user.friendsIds.includes(id)) {
      newUserFriendsIds = user.friendsIds.filter((friendId) => friendId !== id);
    } else {
      newUserFriendsIds = [...user.friendsIds, id];
    }

    return adapter.updateOne(
      {
        id: state.currentUserId,
        changes: {
          friendsIds: newUserFriendsIds,
        },
      },
      state
    );
  })
);
