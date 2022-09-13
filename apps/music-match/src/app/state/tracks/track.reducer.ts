import { createReducer, on } from '@ngrx/store';
import { TrackDto } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as PlaylistActions from '../playlists/playlist.action';
import * as ReleaseActions from '../releases/release.action';
import * as TrackActions from './track.action';

export interface TracksState extends EntityState<TrackDto> {
  selectedTrackId: number;
}

export const adapter = createEntityAdapter<TrackDto>();

export const initialState: TracksState = adapter.getInitialState({
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
);
