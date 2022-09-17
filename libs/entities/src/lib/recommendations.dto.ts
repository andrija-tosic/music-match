import { Artist } from './artist/artist.entity';
import { Release } from './release/release.entity';
import { User } from './user/user.entity';

export type RecommendationsDto = {
  artistsBasedOnGenres: Artist[];
  releasesBasedOnGenres: Release[];
  artistsFromFriends: Artist[];
  releasesFromFriends: Release[];
  newUsersBasedOnGenres: User[];
};
