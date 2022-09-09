import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}
  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated().pipe(
      tap((authenticated) => {
        if (!authenticated) this.router.navigate(['/login']);
      })
    );
  }
}
