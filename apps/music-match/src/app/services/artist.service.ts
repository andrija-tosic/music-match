import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Artist,
  CreateArtistDto,
  UpdateArtistDto,
} from '@music-match/entities';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  constructor(private http: HttpClient) {}

  getArtistWithReleases(id: number) {
    return this.http.get<Artist>(`${environment.api}/artists/${id}`);
  }

  createArtist(artist: CreateArtistDto) {
    return this.http.post<Artist>(`${environment.api}/artists`, artist);
  }

  updateArtist(id: number, artist: UpdateArtistDto) {
    return this.http.patch<Artist>(`${environment.api}/artists/${id}`, artist);
  }

  deleteArtist(id: number) {
    return this.http.delete<void>(`${environment.api}/artists/${id}`);
  }
}
