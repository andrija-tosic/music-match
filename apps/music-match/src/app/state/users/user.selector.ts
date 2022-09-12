import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';
import { selectPlaylists } from '../playlists/playlist.selector';
import { isNotUndefined } from '../../type-guards';

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

export const selectUsersPlaylists = createSelector(
  selectUsers,
  selectPlaylists,
  (users, playlists) =>
    users.entities[users.currentUserId]
      ? users.entities[users.currentUserId]!.playlistsIds.map(
          (id) => playlists.entities[id]
        ).filter(isNotUndefined)
      : []
);

export const selectUsersLikedPlaylists = createSelector(
  selectUsers,
  selectPlaylists,
  (users, playlists) =>
    users.entities[users.currentUserId]
      ? users.entities[users.currentUserId]!.likedPlaylistsIds.map(
          (id) => playlists.entities[id]
        ).filter(isNotUndefined)
      : []
);
