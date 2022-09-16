import {
  Artist,
  CreateArtistDto,
  UpdateArtistDto,
} from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadArtistWithReleases = createAction(
  '[Artist] Init load artist with releases',
  props<{ id: number }>()
);
export const loadedArtistWithReleases = createAction(
  '[Artist] Loaded artist with releases',
  props<{ artist: Artist }>()
);

export const createArtist = createAction(
  '[Artist] Init create artist',
  props<{ artist: CreateArtistDto }>()
);

export const createdArtist = createAction(
  '[Artist] Created artist',
  props<{ artist: Artist }>()
);

export const updateSelectedArtist = createAction(
  '[Artist] Init update selected artist',
  props<{ artist: UpdateArtistDto }>()
);

export const updatedSelectedArtist = createAction(
  '[Artist] Updated selected artist',
  props<{ artist: Artist }>()
);

export const deleteArtist = createAction(
  '[Artist] Init delete artist',
  props<{ id: number }>()
);

export const deletedArtist = createAction('[Artist] Deleted artist');
