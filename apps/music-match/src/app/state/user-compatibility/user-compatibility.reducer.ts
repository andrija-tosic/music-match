import { createReducer, on } from '@ngrx/store';
import { UsersCompatibilityEntity as UserCompatibilityEntity } from '@music-match/state-entities';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as UserCompatibilityActions from './user-compatibility.actions';

export interface UserCompatibilityState
  extends EntityState<UserCompatibilityEntity> {}

const adapter = createEntityAdapter<UserCompatibilityEntity>({
  selectId: (entity: UserCompatibilityEntity) => entity.withUserId,
});

const initialState: UserCompatibilityState = adapter.getInitialState({});

export const userCompatibilityReducer = createReducer(
  initialState,
  on(
    UserCompatibilityActions.usersCompatibilityLoaded,
    (state, { userCompatibility }) =>
      adapter.upsertOne(
        {
          ...userCompatibility,

          artistResults: userCompatibility.artistResults.map((artist) => {
            return {
              artistId: artist.id,
              occurences: artist.occurences,
            };
          }),

          genreResults: userCompatibility.genreResults.map((genre) => {
            return {
              genre: genre.type.toString(),
              occurences: genre.occurences,
            };
          }),
        },
        state
      )
  )
);
