import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscriber } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  readFile(imageFile: any): Observable<string> {
    return new Observable((observer: Subscriber<any>): void => {
      if (imageFile['type'].split('/')[0] !== 'image') {
        observer.error('File is not an image');
      }
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        observer.next(imageUrl);
        observer.complete();
      };

      reader.onerror = (error: any): void => {
        observer.error(error);
      };
    });
  }

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
