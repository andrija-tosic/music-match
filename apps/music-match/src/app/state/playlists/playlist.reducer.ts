import * as Actions from './playlist.action';
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { PlaylistEntity } from '@music-match/state-entities';

export interface PlaylistsState extends EntityState<PlaylistEntity> {
  selectedPlaylistId: number;
}

const adapter = createEntityAdapter<PlaylistEntity>();

export const initialState: PlaylistsState = adapter.getInitialState({
  selectedPlaylistId: -1,
});

export const playlistReducer = createReducer(
  initialState,
  on(Actions.loadedPlaylistWithTracks, (state, { playlist }) => {
    return {
      ...adapter.upsertOne(
        {
          ...playlist,
          ownerIds: playlist.owners.map(({ id }) => id),
          trackIds: playlist.tracks.map(({ id }) => id),
        },
        state
      ),

      selectedPlaylistId: playlist.id,
    };
  }),
  on(
    Actions.loadedUserPlaylists,
    (state, { usersPlaylists, usersLikedPlaylists }) => {
      const newLikedPlaylists = <PlaylistEntity[]>usersLikedPlaylists; //.map(p =>  {return{...p, description: '', liked: true }}) ;
      const newUsersPlaylists = <PlaylistEntity[]>usersPlaylists; //.map(p => { return { ...p, description: '', liked: false}});

      return adapter.upsertMany(
        newLikedPlaylists.concat(newUsersPlaylists),
        state
      );
    }
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
  // on(Actions.addTracksToPlaylistSuccess, (state, { tracks }) => {
  //   const playlist = state.entities[state.selectedPlaylistId]!;

  //   return {
  //     ...playlistAdapter.upsertOne(
  //       {
  //         ...playlist,
  //         trackIds: tracks.map(({ id }) => id),
  //       },
  //       state
  //     ),
  //   };
  // }),
  on(
    Actions.removedTracksFromPlaylist,
    Actions.addedTracksToPlaylist,
    (state, { tracks }) => {
      const playlist = state.entities[state.selectedPlaylistId]!;

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
  )
);
