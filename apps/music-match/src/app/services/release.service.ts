import { ReleaseEntity } from './../state/releases/release.reducer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  constructor(private http: HttpClient) {}

  getRelease(id: number) {
    return this.http.get<ReleaseEntity>(`${environment.api}/releases/${id}`);
  }
}
