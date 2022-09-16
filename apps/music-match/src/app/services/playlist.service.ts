import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddTrackDto,
  Playlist,
  PlaylistDto,
  UpdatePlaylistDto,
  TrackDto,
  RemoveTrackDto,
  CreatePlaylistDto,
  ChangeTrackPositionDto,
} from '@music-match/entities';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserPlaylists(id: number) {
    return this.http.get<{
      playlists: Playlist[];
      likedPlaylists: Playlist[];
    }>(`${environment.api}/users/${id}/playlists`);
  }

  getCurrentUserPlaylists() {
    return this.authService.getUser().pipe(
      switchMap((user) => {
        return this.http.get<{
          playlists: Playlist[];
          likedPlaylists: Playlist[];
        }>(`${environment.api}/users/${user.id}/playlists`);
      })
    );
  }

  getPlaylist(id: number) {
    return this.http.get<PlaylistDto>(`${environment.api}/playlists/${id}`);
  }

  createPlaylist(playlist: CreatePlaylistDto) {
    return this.http.post<PlaylistDto>(
      `${environment.api}/playlists`,
      playlist
    );
  }

  updatePlaylist(id: number, playlist: UpdatePlaylistDto) {
    return this.http.patch<PlaylistDto>(
      `${environment.api}/playlists/${id}`,
      playlist
    );
  }

  deletePlaylist(id: number) {
    return this.http.delete<void>(`${environment.api}/playlists/${id}`);
  }

  toggleLike(id: number) {
    return this.http.put(`${environment.api}/playlists/${id}/toggle-like`, {});
  }

  addTracks(id: number, tracksDto: AddTrackDto) {
    return this.http.post<TrackDto[]>(
      `${environment.api}/playlists/${id}/tracks`,
      tracksDto
    );
  }

  removeTracks(id: number, tracksDto: RemoveTrackDto) {
    return this.http.delete<TrackDto[]>(
      `${environment.api}/playlists/${id}/tracks`,
      {
        body: tracksDto,
      }
    );
  }

  changeTrackPosition(playlistId: number, fromIndex: number, toIndex: number) {
    return this.http.patch<void>(
      `${environment.api}/playlists/${playlistId}/tracks/change-position`,
      <ChangeTrackPositionDto>{
        fromIndex,
        toIndex,
      }
    );
  }

  addCollaborator(playlistId: number, userId: number) {
    return this.http.post<PlaylistDto>(
      `${environment.api}/playlists/${playlistId}/owners/${userId}`,
      {}
    );
  }

  removeCollaborator(playlistId: number, userId: number) {
    return this.http.delete<void>(
      `${environment.api}/playlists/${playlistId}/owners/${userId}`,
      {}
    );
  }
}
