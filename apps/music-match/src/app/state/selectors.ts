import { PlaylistDto } from '@music-match/entities';
import { ArtistEntity } from '@music-match/state-entities';
import { createSelector } from '@ngrx/store';
import { isNotUndefined } from '../type-guards';
import { selectArtists } from './artists/artist.selector';
import { selectPlaylists } from './playlists/playlist.selectors';
import { selectReleases } from './releases/release.selectors';
import { selectTracks } from './tracks/track.selectors';
import { selectUserCompatibilityById } from './user-compatibility/user-compatibility.selectors';
import { selectCurrentUser, selectUsers } from './users/user.selectors';

export const selectedPlaylist = createSelector(
  selectPlaylists,
  selectTracks,
  selectUsers,
  selectCurrentUser,
  (playlists, tracks, users, currentUser) => {
    const playlist = playlists.entities[playlists.selectedPlaylistId];

    return playlist
      ? <PlaylistDto>{
          ...playlist,
          tracks: playlist.trackIds
            ?.map((id) => tracks.entities[id])
            .filter(isNotUndefined),
          owners: playlist.ownerIds
            ?.map((id) => users.entities[id])
            .filter(isNotUndefined),

          liked: currentUser?.likedPlaylistsIds.includes(playlist.id),
        }
      : undefined;
  }
);

export const selectedArtist = createSelector(
  selectArtists,
  selectReleases,
  (artists, releases) => {
    const artist = artists.entities[artists.selectedArtistId];

    return artist
      ? {
          ...artist,
          releases: artist.releaseIds
            .map((id) => releases.entities[id])
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

export const selectedUser = createSelector(
  selectUsers,
  selectPlaylists,
  (users, playlists) => {
    const user = users.entities[users.selectedUserId];

    return user
      ? {
          ...user,
          playlists: user.playlistsIds
            .map((id) => playlists.entities[id])
            .filter(isNotUndefined),
          likedPlaylists: user.likedPlaylistsIds
            .map((id) => playlists.entities[id])
            .filter(isNotUndefined),
        }
      : undefined;
  }
);

export interface UserCompatibilityReport {
  artists: ArtistEntity[];
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
