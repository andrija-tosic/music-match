import * as Actions from './playlist.action';
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { PlaylistEntity } from '@music-match/state-entities';

export interface PlaylistsState extends EntityState<PlaylistEntity> {
  selectedPlaylistId: number;
}

const playlistAdapter = createEntityAdapter<PlaylistEntity>();

export const initialState: PlaylistsState = playlistAdapter.getInitialState({
  selectedPlaylistId: -1,
});

export const playlistReducer = createReducer(
  initialState,
  on(Actions.loadPlaylistWithTracksSuccess, (state, { playlist }) => {
    return {
      ...playlistAdapter.upsertOne(
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
    Actions.loadUserPlaylistsSuccess,
    (state, { usersPlaylists, usersLikedPlaylists }) => {
      const newLikedPlaylists = <PlaylistEntity[]>usersLikedPlaylists; //.map(p =>  {return{...p, description: '', liked: true }}) ;
      const newUsersPlaylists = <PlaylistEntity[]>usersPlaylists; //.map(p => { return { ...p, description: '', liked: false}});

      return playlistAdapter.upsertMany(
        newLikedPlaylists.concat(newUsersPlaylists),
        state
      );
    }
  ),
  on(Actions.updateSelectedPlaylistSuccess, (state, { playlist }) => {
    return {
      ...playlistAdapter.upsertOne(
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
    Actions.removeTracksFromPlaylistSuccess,
    Actions.addTracksToPlaylistSuccess,
    (state, { tracks }) => {
      const playlist = state.entities[state.selectedPlaylistId]!;

      return playlistAdapter.updateOne(
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
