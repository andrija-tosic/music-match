import { User, UserCompatibilityDto } from '@music-match/entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: number) {
    return this.http.get<User>(`${environment.api}/users/${id}`);
  }

  getUserMusicMatch(id: number) {
    return this.http.get<UserCompatibilityDto>(
      `${environment.api}/users/${id}/music-match`
    );
  }
}
