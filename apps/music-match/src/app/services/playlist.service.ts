import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist, PlaylistDto } from '@music-match/entities';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserPlaylists() {
    return this.authService.getUser().pipe(
      switchMap((user) => {
        return this.http.get<{ playlists: Playlist[]; likedPlaylists: Playlist[] }>(
          `${environment.api}/users/${user.id}/playlists`
        );
      })
    );
  }

  getPlaylist(id: number) {
    return this.http.get<PlaylistDto>(`${environment.api}/playlists/${id}`);
  }
}
