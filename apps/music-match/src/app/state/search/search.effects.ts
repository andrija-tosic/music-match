import { SearchResultsDto } from '@music-match/entities';
import { SearchService } from '../../services/search.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import * as SearchActions from './search.actions';

@Injectable()
export class SearchEffects {
  loadSearchResult$ = createEffect(() =>
    this.action$.pipe(
      ofType(SearchActions.querySearch),
      switchMap(({ query }) =>
        this.searchService.search(query).pipe(
          map((searchResults) => {
            const searchResultsWithQuery: SearchResultsDto = {
              ...searchResults,
              query,
            };
            return SearchActions.queriedSearch({
              searchResults: searchResultsWithQuery,
            });
          })
        )
      )
    )
  );

  constructor(private action$: Actions, private searchService: SearchService) {}
}
