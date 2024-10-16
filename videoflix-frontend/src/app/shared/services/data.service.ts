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

  /**
   * Retrieves authentication headers including the user's token.
   *
   * @returns {HttpHeaders} The headers containing the authentication token.
   */
  getAuthHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('token')}`,
    });
    return headers;
  }

  /**
   * Sends video data to the backend for storage.
   *
   * @param {Object} uploadVideoData - The video data to be uploaded.
   * @returns {Observable<any>} An observable containing the server response.
   */
  setVideosInBackend(uploadVideoData: { [key: string]: any }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, uploadVideoData, { headers });
  }

  /**
   * Retrieves a list of videos from the backend.
   *
   * @param {HttpHeaders} headers - The headers containing the authentication token.
   * @returns {Observable<any[]>} An observable containing the list of videos.
   */
  getVideosFromBackend(headers: HttpHeaders) {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  /**
   * Loads video data from the backend and updates the internal state.
   *
   * @param {HttpHeaders} headers - The headers containing the authentication token.
   */
  async loadVideoData(headers: HttpHeaders) {
    this.getVideosFromBackend(headers).subscribe({
      next: (data) => {
        this.videoData = data;
        this.videoDataSubject.next(this.videoData);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Videodaten', error);
      },
    });
  }

  /**
   * Updates the email observable with a new email value.
   *
   * @param {string} email - The new email to be set.
   */
  changeEmail(email: string) {
    this.emailSource.next(email);
  }

  /**
   * Gets the current video data stored in the service.
   *
   * @returns {any[]} The array of video data.
   */
  getData(): any[] {
    return this.videoData;
  }

  /**
   * Finds a video by its name from the video data.
   *
   * @param {string} name - The name of the video to find.
   * @returns {any | undefined} The video object if found, otherwise undefined.
   */
  getVideoByName(name: string) {
    return this.videoData.find((video) => video.name === name);
  }

  /**
   * Updates the categories of a specific video.
   *
   * @param {number} id - The ID of the video to update.
   * @param {string[]} categories - The new categories to set for the video.
   */
  updateVideoCategories(id: number, categories: string[]) {
    const video = this.videoData.find((video) => video.id === id);

    if (video) {
      video.categories = categories;
      this.videoDataSubject.next(this.videoData);
    } else {
      console.error(`Video mit der ID ${id} wurde nicht gefunden.`);
    }
  }

  /**
   * Sends a PATCH request to update video data in the backend.
   *
   * @param {number} videoId - The ID of the video to update.
   * @param {Object} videoData - The data to update the video with.
   * @returns {Promise<any>} A promise that resolves with the server response.
   */
  async patchBackendVideo(videoId: number, videoData: {}): Promise<any> {
    const headers = this.getAuthHeaders();

    return firstValueFrom(
      this.http.patch<any>(`${this.apiUrl}${videoId}/`, videoData, {
        headers,
      })
    );
  }

  /**
   * Deletes a video from the backend.
   *
   * @param {number} videoId - The ID of the video to delete.
   * @returns {Promise<any>} A promise that resolves with the server response.
   */
  deleteBackendVideo(videoId: number): Promise<any> {
    const headers = this.getAuthHeaders();

    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}${videoId}/`, { headers }));
  }

  /**
   * Updates the categories of a specific video in the backend.
   *
   * @param {number} videoId - The ID of the video to update.
   * @param {string[]} categories - The new categories to set for the video.
   * @returns {Observable<any>} An observable containing the server response.
   */
  patchBackendVideoCategories(videoId: number, categories: string[]): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { categories: categories };
    return this.http.patch<any[]>(`${this.apiUrl}${videoId}/`, body, {
      headers,
    });
  }

  /**
   * Checks the status of the thumbnail generation for a specific video.
   *
   * @param {string} videoName - The name of the video to check.
   * @returns {Observable<{ status: string }>} An observable containing the status of the thumbnail.
   */
  loadThumbnailStatus(videoName: string) {
    return this.http.get<{ status: string }>(`${this.baseUrl}check-thumbnail-status/${videoName}`);
  }

  /**
   * Checks the conversion status for a specific video.
   *
   * @param {string} videoName - The name of the video to check.
   * @returns {Observable<{ status: string }>} An observable containing the status of the conversion.
   */
  loadConvertionStatus(videoName: string) {
    return this.http.get<{ status: string }>(`${this.baseUrl}check-convertion-status/${videoName}`);
  }

  /**
   * Triggers a check for the conversion status of a video.
   *
   * @param {string} videoName - The name of the video for which to trigger the conversion check.
   */
  triggerConvertionCheck(videoName: string) {
    this.conversionCheckSubject.next(videoName);
  }
}
