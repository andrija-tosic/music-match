import { SearchResultsDto, TrackDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const toggleTrackLike = createAction(
  'Init toggle track like',
  props<{ id: number }>()
);

export const toggledTrackLike = createAction(
  'Toggled track like',
  props<{ track: TrackDto }>()
);
