import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoPopupService {
  private videoNameSubject = new BehaviorSubject<string | null>(null);
  public videoName$ = this.videoNameSubject.asObservable();

  private editVideoNameSubject = new BehaviorSubject<string | null>(null);
  public editVideoName$ = this.editVideoNameSubject.asObservable();

  private addVideoPopupStatus = new BehaviorSubject<boolean>(false);
  addVideoPopupStatus$ = this.addVideoPopupStatus.asObservable();

  private editVideoPopupStatus = new BehaviorSubject<string | null>(null);
  editVideoPopupStatus$ = this.editVideoPopupStatus.asObservable();

  private triggerCountVideos = new BehaviorSubject<void>(undefined);
  triggerCountVideos$ = this.triggerCountVideos.asObservable();

  /**
   * Opens the video popup and sets the current video name.
   *
   * @param {string} videoName - The name of the video to be displayed in the popup.
   */
  openVideoPopup(videoName: string) {
    this.videoNameSubject.next(videoName);
  }

  /**
   * Closes the video popup by resetting the current video name.
   */
  closeVideoPopup() {
    this.videoNameSubject.next(null);
  }

  /**
   * Opens the add video popup and triggers a count of videos.
   */
  openAddVideoPopup() {
    this.addVideoPopupStatus.next(true);
    this.triggerCountVideos.next();
  }

  /**
   * Closes the add video popup.
   */
  closeAddVideoPopup() {
    this.addVideoPopupStatus.next(false);
  }

  /**
   * Opens the edit video popup and sets the name of the video to be edited.
   *
   * @param {string} videoName - The name of the video to be edited.
   */
  openEditVideoPopup(videoName: string) {
    this.editVideoNameSubject.next(videoName);
  }

  /**
   * Closes the edit video popup by resetting the current video name.
   */
  closeEditVideoPopup() {
    this.editVideoNameSubject.next(null);
  }
}
