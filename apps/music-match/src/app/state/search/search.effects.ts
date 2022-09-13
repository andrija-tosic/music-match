import { SearchResultsDto } from '@music-match/entities';
import { SearchService } from './../../search.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import * as SearchActions from '../search/search.action';

@Injectable()
export class SearchEffects {
  constructor(private action$: Actions, private searchService: SearchService) {}
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
}
