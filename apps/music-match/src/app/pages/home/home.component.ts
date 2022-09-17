import { Component } from '@angular/core';
import { RecommendationsEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../app.state';
import { loadRecommendations } from '../../state/recommendations/recommendation.actions';
import { selectRecommendations } from '../../state/recommendations/recommendation.selectors';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  recommendations$: Observable<RecommendationsEntity>;

  constructor(private store: Store<AppState>) {
    this.store.dispatch(loadRecommendations());

    this.recommendations$ = this.store.select(selectRecommendations);
  }
}
