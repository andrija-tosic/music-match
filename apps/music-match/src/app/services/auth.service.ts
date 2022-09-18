import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserDto, LoginUserDto, User } from '@music-match/entities';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppState } from '../app.state';
import { constants } from '../constants';
import { loadUser, setCurrentUserId } from '../state/users/user.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private store: Store<AppState>
  ) {}

  isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(
      map((user: User) => {
        if (user) {
          return true;
        }

        return false;
      }),
      catchError((error) => {
        console.error(error);
        return of(false);
      })
    );
  }

  public login(credentials: LoginUserDto) {
    return this.http
      .post<User>(`${environment.api}/auth/login`, credentials, {
        ...constants.httpOptions,
      })
      .pipe(
        tap((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));

          console.log('[login] loadUser');

          this.store.dispatch(loadUser({ id: user.id }));
          this.store.dispatch(setCurrentUserId({ id: user.id }));
        })
      );
  }

  public register(credentials: CreateUserDto) {
    return this.http.post<User>(`${environment.api}/users`, credentials, {
      ...constants.httpOptions,
    });
  }

  public logout() {
    return this.http
      .get(`${environment.api}/auth/logout`)
      .pipe(tap(() => localStorage.removeItem('user')));
  }

  public getUser() {
    return this.http.get<User>(`${environment.api}/auth/session`);
  }

  public autoLogin() {
    const loggedInUser: string | null = localStorage.getItem('user');

    if (!loggedInUser) return;

    const user: User = JSON.parse(loggedInUser);

    this.store.dispatch(loadUser({ id: user.id }));
    this.store.dispatch(setCurrentUserId({ id: user.id }));
  }
}
