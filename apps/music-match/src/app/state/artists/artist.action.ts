import { createAction, props } from '@ngrx/store';

export const loadArtists = createAction('Load artists');
export const loadArtistsSuccess = createAction('Load artists success');
export const selectArtist = createAction('Select artist', props<{ artistId: number }>());
