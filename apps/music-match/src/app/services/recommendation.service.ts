import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecommendationsDto } from '@music-match/entities';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  constructor(private http: HttpClient) {}

  getRecommendationsForCurrentUser() {
    return this.http.get<RecommendationsDto>(
      `${environment.api}/recommendations`
    );
  }
}
