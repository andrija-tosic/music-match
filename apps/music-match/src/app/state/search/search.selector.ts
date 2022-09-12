import { selectTracks } from './../tracks/track.selector';
import { selectPlaylists } from './../playlists/playlist.selector';
import { selectUsers } from './../users/user.selector';
import { selectArtists } from './../artists/artist.selector';
import { selectReleases } from './../releases/release.selector';
import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';
import { isNotUndefined } from '../../type-guards';

export const selectSearchResults = (query: string) =>
  createSelector(
    (state: AppState) => state.searchResults,
    (searchResults) => searchResults.entities[query]
  );

export const selectArtistsFromSearchResults = (query: string) =>
  createSelector(
    selectSearchResults(query),
    selectArtists,
    (searchResults, artists) => {
      return searchResults?.artistIds
        .map((id) => artists.entities[id])
        .filter(isNotUndefined);
    }
  );

export const selectReleasesFromSearchResults = (query: string) =>
  createSelector(
    selectSearchResults(query),
    selectReleases,
    (searchResults, releases) =>
      searchResults?.releaseIds
        .map((id) => releases.entities[id])
        .filter(isNotUndefined)
  );

export const selectTracksFromSearchResults = (query: string) =>
  createSelector(
    selectSearchResults(query),
    selectTracks,
    (searchResults, tracks) =>
      searchResults?.trackIds
        .map((id) => tracks.entities[id])
        .filter(isNotUndefined)
  );

export const selectUsersFromSearchResults = (query: string) =>
  createSelector(
    selectSearchResults(query),
    selectUsers,
    (searchResults, users) =>
      searchResults?.userIds
        .map((id) => users.entities[id])
        .filter(isNotUndefined)
  );

export const selectPlaylistsFromSearchResults = (query: string) =>
  createSelector(
    selectSearchResults(query),
    selectPlaylists,
    (searchResults, playlists) =>
      searchResults?.playlistIds
        .map((id) => playlists.entities[id])
        .filter(isNotUndefined)
  );
