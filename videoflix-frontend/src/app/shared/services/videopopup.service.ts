import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoPopupService {
  private videoNameSubject = new BehaviorSubject<string | null>(null);
  public videoName$ = this.videoNameSubject.asObservable();

  private addVideoPopupStatus = new BehaviorSubject<boolean>(false);
  addVideoPopupStatus$ = this.addVideoPopupStatus.asObservable();

  private editVideoPopupStatus = new BehaviorSubject<boolean>(false);
  editVideoPopupStatus$ = this.editVideoPopupStatus.asObservable();

  private triggerCountVideos = new BehaviorSubject<void>(undefined);
  triggerCountVideos$ = this.triggerCountVideos.asObservable();

  openVideoPopup(videoName: string) {
    this.videoNameSubject.next(videoName);
  }

  closeVideoPopup() {
    this.videoNameSubject.next(null);
  }

  openAddVideoPopup() {
    this.addVideoPopupStatus.next(true);
    this.triggerCountVideos.next();
  }

  closeAddVideoPopup() {
    this.addVideoPopupStatus.next(false);
  }

  openEditVideoPopup() {
    this.editVideoPopupStatus.next(true);
  }

  closeEditVideoPopup() {
    this.editVideoPopupStatus.next(false);
  }
}
