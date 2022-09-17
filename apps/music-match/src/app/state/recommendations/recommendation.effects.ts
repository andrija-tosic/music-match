import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { RecommendationService } from '../../services/recommendation.service';
import * as RecommendationActions from './recommendation.actions';

@Injectable()
export class RecommendationsEffects {
  constructor(
    private action$: Actions,
    private recommendationService: RecommendationService
  ) {}

  getRecommendation$ = createEffect(() =>
    this.action$.pipe(
      ofType(RecommendationActions.loadRecommendations),
      switchMap(() =>
        this.recommendationService
          .getRecommendationsForCurrentUser()
          .pipe(
            map((recommendations) =>
              RecommendationActions.loadedRecommendations({ recommendations })
            )
          )
      )
    )
  );
}
