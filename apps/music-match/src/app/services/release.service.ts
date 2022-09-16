import {
  CreateReleaseDto,
  Release,
  ReleaseDto,
  UpdateReleaseDto,
} from '@music-match/entities';
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

  createRelease(release: CreateReleaseDto) {
    return this.http.post<Release>(`${environment.api}/releases`, release);
  }

  updateRelease(release: UpdateReleaseDto) {
    return this.http.patch<Release>(`${environment.api}/releases`, release);
  }

  deleteRelease(id: number) {
    return this.http.delete<void>(`${environment.api}/releases/${id}`);
  }
}
