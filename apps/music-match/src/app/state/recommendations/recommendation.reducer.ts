import { RecommendationsEntity } from '@music-match/state-entities';
import { createReducer, on } from '@ngrx/store';
import * as Actions from './recommendation.actions';

const initialState: RecommendationsEntity = {
  artistsBasedOnGenres: [],
  releasesBasedOnGenres: [],
  artistsFromFriends: [],
  releasesFromFriends: [],
  newUsersBasedOnGenres: [],
};

export const recommendationReducer = createReducer<RecommendationsEntity>(
  initialState,
  on(Actions.loadedRecommendations, (state, { recommendations }) => {
    return {
      artistsBasedOnGenres: recommendations.artistsBasedOnGenres.map(
        (artist) => {
          return {
            ...artist,
            releaseIds: [],
          };
        }
      ),
      releasesBasedOnGenres: recommendations.releasesBasedOnGenres.map(
        (release) => {
          return {
            ...release,
            artistIds: [],
            trackIds: [],
          };
        }
      ),
      artistsFromFriends: recommendations.artistsFromFriends.map((artist) => {
        return {
          ...artist,
          releaseIds: [],
        };
      }),
      releasesFromFriends: recommendations.releasesFromFriends.map(
        (release) => {
          return {
            ...release,
            artistIds: [],
            trackIds: [],
          };
        }
      ),
      newUsersBasedOnGenres: recommendations.newUsersBasedOnGenres.map(
        (user) => {
          return {
            ...user,
            likedPlaylistsIds: [],
            playlistsIds: [],
            friendsIds: [],
          };
        }
      ),
    };
  })
);
