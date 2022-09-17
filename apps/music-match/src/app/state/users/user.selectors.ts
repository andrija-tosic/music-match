import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';
import { isNotUndefined } from '../../type-guards';
import { selectPlaylists } from '../playlists/playlist.selectors';

export const selectUsers = createSelector(
  (state: AppState) => state.users,
  (users) => users
);

export const selectUserById = (id: number) =>
  createSelector(selectUsers, (users) => users.entities[id]);

export const selectUsersByIds = (ids: number[]) =>
  createSelector(selectUsers, (users) =>
    ids.map((id) => users.entities[id]).filter(isNotUndefined)
  );

export const selectCurrentUser = createSelector(
  selectUsers,
  (users) => users.entities[users.currentUserId]
);

export const selectCurrentUsersFriends = createSelector(
  selectUsers,
  selectCurrentUser,
  (users, user) => {
    return user?.friendsIds
      .map((id) => users.entities[id])
      .filter(isNotUndefined);
  }
);

export const selectCurrentUsersPlaylists = createSelector(
  selectCurrentUser,
  selectPlaylists,
  (user, playlists) =>
    user
      ? user.playlistsIds
          .map((id) => playlists.entities[id])
          .filter(isNotUndefined)
      : []
);

export const selectCurrentUsersLikedPlaylists = createSelector(
  selectCurrentUser,
  selectPlaylists,
  (user, playlists) =>
    user
      ? user.likedPlaylistsIds
          .map((id) => playlists.entities[id])
          .filter(isNotUndefined)
      : []
);
