import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResultsDto } from '@music-match/entities';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string) {
    return this.http.get<SearchResultsDto>(
      `${environment.api}/search/${query}`
    );
  }
}
