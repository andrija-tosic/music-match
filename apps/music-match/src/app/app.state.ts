import { TracksState } from './state/tracks/track.reducer';
import { UsersState } from './state/users/user.reducer';
import { ReleasesState } from './state/releases/release.reducer';
import { SearchState } from './state/search/search.reducer';
import { PlaylistsState } from './state/playlists/playlist.reducer';
import { ArtistsState } from './state/artists/artist.reducer';

export interface AppState {
  artists: ArtistsState;
  releases: ReleasesState;
  tracks: TracksState;
  users: UsersState;
  playlists: PlaylistsState;
  searchResults: SearchState;
}
