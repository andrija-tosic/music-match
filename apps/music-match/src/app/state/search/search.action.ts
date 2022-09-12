import { SearchResultsDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const querySearch = createAction(
  'Query search',
  props<{ query: string }>()
);
export const querySearchSuccess = createAction(
  'Query search success',
  props<{ searchResults: SearchResultsDto }>()
);
