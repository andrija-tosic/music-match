import { Release, ReleaseDto } from '@music-match/entities';
import { ReleaseEntity } from '@music-match/state-entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  constructor(private http: HttpClient) {}

  getRelease(id: number) {
    return this.http.get<ReleaseDto>(`${environment.api}/releases/${id}`);
  }
}
