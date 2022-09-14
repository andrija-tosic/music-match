import { AppState } from './../app.state';
import { selectArtists } from './artists/artist.selector';
import { selectReleases } from './releases/release.selector';
import { selectUsers } from './users/user.selector';
import { selectTracks } from './tracks/track.selector';
import { createSelector } from '@ngrx/store';
import { selectPlaylists } from './playlists/playlist.selector';
import { isNotUndefined } from '../type-guards';
import { selectUserCompatibilityById } from './user-compatibility/user-compatibility.selector';
import { Artist } from '@music-match/entities';

export const selectedPlaylist = createSelector(
  selectPlaylists,
  selectTracks,
  selectUsers,
  (playlists, tracks, users) => {
    const playlist = playlists.entities[playlists.selectedPlaylistId];

    return playlist
      ? {
          ...playlist,
          tracks: playlist.trackIds
            .map((id) => tracks.entities[id])
            .filter(isNotUndefined),
          owners: playlist.ownerIds
            .map((id) => users.entities[id])
            .filter(isNotUndefined),
        }
      : undefined;
  }
);

export const selectedRelease = createSelector(
  selectReleases,
  selectArtists,
  selectTracks,
  (releases, artists, tracks) => {
    const release = releases.entities[releases.selectedReleaseId];

    return release
      ? {
          ...release,
          tracks: release.trackIds
            .map((id) => tracks.entities[id])
            .filter(isNotUndefined),
          artists: release.artistIds
            .map((id) => artists.entities[id])
            .filter(isNotUndefined),
        }
      : undefined;
  }
);

export interface UserCompatibilityReport {
  artists: Artist[];
  genres: string[];
}

export const selectUserCompatibilityReport = (id: number) =>
  createSelector(
    selectArtists,
    selectUserCompatibilityById(id),
    (artists, userCompatibility) => {
      return userCompatibility
        ? {
            artists: userCompatibility.artistResults
              .map(({ artistId }) => artistId)
              .map((artistId) => artists.entities[artistId])
              .filter(isNotUndefined),

            genres: userCompatibility.genreResults.map(({ genre }) => genre),
          }
        : undefined;
    }
  );
