import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  videoData: any[] = [];

  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();
  private videoDataSubject = new BehaviorSubject<any[]>(this.videoData);
  videoData$ = this.videoDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  getVideosFromBackend() {
    return this.http.get<any[]>('http://localhost:8000/api/videos/');
  }

  async loadVideoData() {
    this.getVideosFromBackend().subscribe({
      next: (data) => {
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

  getData(key: string): any[] {
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
