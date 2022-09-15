import { SearchResultsDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const querySearch = createAction(
  '[Search] Init query search',
  props<{ query: string }>()
);
export const queriedSearch = createAction(
  '[Search] Queried search',
  props<{ searchResults: SearchResultsDto }>()
);
