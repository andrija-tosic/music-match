import { User, CreateUserDto } from '@music-match/entities';
import { LoginUserDto } from '@music-match/entities';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { constants } from '../constants';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.user().pipe(
      map((user: User) => {
        console.log(user);
        return user ? true : false;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  public login(credentials: LoginUserDto) {
    return this.http.post<User>(`${environment.api}/auth/login`, credentials, { ...constants.httpOptions }).pipe(
      tap((user: User) => {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  public register(credentials: CreateUserDto) {
    return this.http.post<User>(`${environment.api}/users`, credentials, { ...constants.httpOptions });
  }

  public logout() {
    return this.http.get(`${environment.api}/auth/logout`);
  }

  public user() {
    return this.http.get<User>(`${environment.api}/auth/session`);
  }

  public autoLogin() {
    const loggedInUser: string | null = localStorage.getItem('user');
    if (!loggedInUser) return;
  }
}
