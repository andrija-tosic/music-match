import { Artist } from '@music-match/entities';
import * as Actions from './artist.action';
import { createReducer, on } from '@ngrx/store';

export interface ArtistsState {
  artists: Artist[];
  selectedArtist: number;
}

export const initialState: ArtistsState = { artists: [], selectedArtist: 0 };

export const artistReducer = createReducer(
  initialState,
  on(Actions.selectArtist, (state, { artistId }) => {
    return {
      ...state,
      selectedArtist: artistId,
    };
  })
);
