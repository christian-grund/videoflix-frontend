import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  videoData: any[] = [];

  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();
  private videoDataSubject = new BehaviorSubject<any[]>(this.videoData);
  videoData$ = this.videoDataSubject.asObservable();

  private apiUrl = 'http://localhost:8000/api/videos/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  setData(uploadVideoData: { [key: string]: any }): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'api/videos/', uploadVideoData);
  }

  getVideosFromBackend(headers: HttpHeaders) {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  async loadVideoData(headers: HttpHeaders) {
    this.getVideosFromBackend(headers).subscribe({
      next: (data) => {
        console.log('Videodaten geladen:', data);
        this.videoData = data;
        this.videoDataSubject.next(this.videoData);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Videodaten', error);
      },
    });
  }

  changeEmail(email: string) {
    this.emailSource.next(email);
  }

  getData(): any[] {
    return this.videoData;
  }

  getVideoByName(name: string) {
    return this.videoData.find((video) => video.name === name);
  }

  updateVideoCategories(id: number, categories: string[]) {
    const video = this.videoData.find((video) => video.id === id);

    if (video) {
      video.categories = categories;
      this.videoDataSubject.next(this.videoData);
    } else {
      console.error(`Video mit der ID ${id} wurde nicht gefunden.`);
    }
  }

  patchBackendVideo(id: number, categories: string[]): Observable<any> {
    return this.http.patch<any[]>(`http://localhost:8000/api/videos/${id}/`, {
      categories,
    });
  }
}
