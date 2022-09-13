import { SearchResultsDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const querySearch = createAction(
  'Init query search',
  props<{ query: string }>()
);
export const queriedSearch = createAction(
  'Queried search',
  props<{ searchResults: SearchResultsDto }>()
);
