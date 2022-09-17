import { PlaylistEntity } from '@music-match/state-entities';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import * as UserActions from '../users/user.actions';
import * as Actions from './playlist.actions';

export interface PlaylistsState extends EntityState<PlaylistEntity> {
  selectedPlaylistId: number;
}

const adapter = createEntityAdapter<PlaylistEntity>();

const initialState: PlaylistsState = adapter.getInitialState({
  selectedPlaylistId: -1,
});

export const playlistReducer = createReducer(
  initialState,
  on(Actions.loadedPlaylistWithTracks, (state, { playlist }) => {
    return playlist
      ? {
          ...adapter.upsertOne(
            {
              ...playlist,

              ownerIds: playlist.owners.map(({ id }) => id),
              trackIds: playlist.tracks.map(({ id }) => id),
            },
            state
          ),

          selectedPlaylistId: playlist.id,
        }
      : state;
  }),
  on(UserActions.loadedUser, (state, { user }) =>
    adapter.addMany(
      [
        ...user.playlists.map((playlist) => {
          return {
            ...playlist,
            liked: false,
            ownerIds: playlist.owners?.map(({ id }) => id),
            trackIds: [],
          };
        }),
        ...user.likedPlaylists.map((playlist) => {
          return {
            ...playlist,
            liked: true,
            ownerIds: playlist.owners?.map(({ id }) => id),
            trackIds: [],
          };
        }),
      ],
      state
    )
  ),
  on(Actions.updatedSelectedPlaylist, (state, { playlist }) => {
    return {
      ...adapter.upsertOne(
        {
          ...playlist,
          ownerIds: playlist.owners.map(({ id }) => id),
          trackIds: playlist.tracks.map(({ id }) => id),
        },
        state
      ),
    };
  }),
  on(
    Actions.addTracksToPlaylist,
    Actions.removeTracksFromPlaylist,
    (state, { id }) => {
      return {
        ...state,
        selectedPlaylistId: id,
      };
    }
  ),
  on(
    Actions.addedTracksToPlaylist,
    Actions.removedTracksFromPlaylist,
    (state, { tracks }) => {
      const playlist = state.entities[state.selectedPlaylistId]!;

      console.log(tracks);

      return adapter.updateOne(
        {
          id: playlist.id,
          changes: {
            trackIds: tracks.map(({ id }) => id),
          },
        },
        state
      );
    }
  ),
  on(Actions.createdPlaylist, (state, { playlist }) =>
    adapter.addOne(
      {
        ...playlist,
        ownerIds: playlist.owners.map(({ id }) => id),
        trackIds: [],
      },
      { ...state, selectedPlaylistId: playlist.id }
    )
  ),
  on(Actions.deletePlaylist, (state, { id }) => adapter.removeOne(id, state)),

  on(Actions.addedCollaboratorToPlaylist, (state, { playlist }) =>
    adapter.updateOne(
      {
        id: playlist.id,
        changes: {
          ownerIds: playlist.owners.map(({ id }) => id),
        },
      },
      state
    )
  ),

  on(Actions.removeCollaboratorFromPlaylist, (state, { playlistId, userId }) =>
    adapter.updateOne(
      {
        id: playlistId,
        changes: {
          ownerIds: state.entities[playlistId]!.ownerIds.filter(
            (id) => id !== userId
          ),
        },
      },
      state
    )
  )
);
