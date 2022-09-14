import { createReducer, on } from '@ngrx/store';
import { TrackDto } from '@music-match/entities';
import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as PlaylistActions from '../playlists/playlist.action';
import * as ReleaseActions from '../releases/release.action';
import * as TrackActions from './track.action';

export interface TracksState extends EntityState<TrackDto> {
  selectedTrackId: number;
}

const adapter = createEntityAdapter<TrackDto>();

const initialState: TracksState = adapter.getInitialState({
  selectedTrackId: -1,
});

export const trackReducer = createReducer(
  initialState,
  on(SearchActions.queriedSearch, (state, searchResults) =>
    adapter.upsertMany(searchResults.searchResults.tracks, state)
  ),
  on(PlaylistActions.loadedPlaylistWithTracks, (state, { playlist }) =>
    adapter.upsertMany(playlist.tracks, state)
  ),
  on(ReleaseActions.loadedRelease, (state, { release }) =>
    adapter.upsertMany(release.tracks, state)
  ),
  on(TrackActions.toggledTrackLike, (state, { track }) =>
    adapter.updateOne({ id: track.id, changes: { liked: track.liked } }, state)
  )
  // on(
  //   PlaylistActions.addedTracksToPlaylist,
  //   PlaylistActions.removedTracksFromPlaylist,
  //   (state, { tracks }) => {
  //     const updates: Update<TrackDto>[] = tracks.map((track) => {
  //       return {
  //         id: track.id,
  //         changes: track,
  //       };
  //     });

  //     return adapter.updateMany(updates, state);
  //   }
  // )
);
