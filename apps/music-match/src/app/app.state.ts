import { RecommendationsEntity } from '@music-match/state-entities';
import { ArtistsState } from './state/artists/artist.reducer';
import { PlaylistsState } from './state/playlists/playlist.reducer';
import { ReleasesState } from './state/releases/release.reducer';
import { SearchState } from './state/search/search.reducer';
import { TracksState } from './state/tracks/track.reducer';
import { UserCompatibilityState } from './state/user-compatibility/user-compatibility.reducer';
import { UsersState } from './state/users/user.reducer';

export interface AppState {
  artists: ArtistsState;
  releases: ReleasesState;
  tracks: TracksState;
  users: UsersState;
  playlists: PlaylistsState;
  searchResults: SearchState;
  userCompatibilities: UserCompatibilityState;
  recommendations: RecommendationsEntity;
}
