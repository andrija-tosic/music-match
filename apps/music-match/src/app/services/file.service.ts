import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, scan } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  uploadImage(image: any) {
    const formData = new FormData();
    formData.append('file', image);
    return this.http
      .post<{ url: string }>(`${environment.api}/files`, formData)
      .pipe(
        map((res) => {
          return res.url;
        })
      );
  }
}
