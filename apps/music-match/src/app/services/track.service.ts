import { environment } from './../../environments/environment';
import { TrackDto } from '@music-match/entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  constructor(private http: HttpClient) {}

  getPlaylistTracks(id: number) {
    return this.http.get<TrackDto[]>(`${environment.api}/playlist/${id}/tracks`);
  }
}
