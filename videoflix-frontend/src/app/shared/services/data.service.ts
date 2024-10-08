import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
// import { isPlatformBrowser } from '@angular/common';
// import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  videoData: any[] = [];

  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();
  private videoDataSubject = new BehaviorSubject<any[]>(this.videoData);
  videoData$ = this.videoDataSubject.asObservable();
  private conversionCheckSubject = new BehaviorSubject<string>('');
  conversionCheck$ = this.conversionCheckSubject.asObservable();

  private baseUrl = 'http://localhost:8000/';
  private apiUrl = 'http://localhost:8000/api/videos/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAuthHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('token')}`,
    });
    return headers;
  }

  setVideosInBackend(uploadVideoData: { [key: string]: any }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, uploadVideoData, { headers });
  }

  getVideosFromBackend(headers: HttpHeaders) {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  async loadVideoData(headers: HttpHeaders) {
    this.getVideosFromBackend(headers).subscribe({
      next: (data) => {
        // console.log('Videodaten geladen:', data);
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

  async patchBackendVideo(videoId: number, videoData: {}): Promise<any> {
    const headers = this.getAuthHeaders();

    return firstValueFrom(
      this.http.patch<any>(`${this.apiUrl}${videoId}/`, videoData, {
        headers,
      })
    );
  }

  deleteBackendVideo(videoId: number): Promise<any> {
    const headers = this.getAuthHeaders();

    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}${videoId}/`, { headers }));
  }

  patchBackendVideoCategories(videoId: number, categories: string[]): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { categories: categories };
    return this.http.patch<any[]>(`${this.apiUrl}${videoId}/`, body, {
      headers,
    });
  }

  loadThumbnailStatus(videoName: string) {
    return this.http.get<{ status: string }>(`${this.baseUrl}check-thumbnail-status/${videoName}`);
  }

  loadConvertionStatus(videoName: string) {
    return this.http.get<{ status: string }>(`${this.baseUrl}check-convertion-status/${videoName}`);
  }

  triggerConvertionCheck(videoName: string) {
    this.conversionCheckSubject.next(videoName); // Video-Name an alle Subscriber senden
  }
}
