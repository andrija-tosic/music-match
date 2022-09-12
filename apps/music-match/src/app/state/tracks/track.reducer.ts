import { createReducer, on } from '@ngrx/store';
import { TrackDto } from '@music-match/entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as SearchActions from '../search/search.action';
import * as PlaylistActions from '../playlists/playlist.action';

export interface TracksState extends EntityState<TrackDto> {
  selectedTrackId: number;
}

export const trackAdapter = createEntityAdapter<TrackDto>();

export const initialState: TracksState = trackAdapter.getInitialState({
  selectedTrackId: -1,
});

export const trackReducer = createReducer(
  initialState,
  on(SearchActions.querySearchSuccess, (state, searchResults) =>
    trackAdapter.upsertMany(searchResults.searchResults.tracks, state)
  ),
  on(PlaylistActions.loadPlaylistWithTracksSuccess, (state, { playlist }) =>
    trackAdapter.upsertMany(playlist.tracks, state)
  )
);
