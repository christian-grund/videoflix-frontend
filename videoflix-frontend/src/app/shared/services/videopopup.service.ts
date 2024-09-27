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

  openVideoPopup(videoName: string) {
    this.videoNameSubject.next(videoName);
  }

  closeVideoPopup() {
    this.videoNameSubject.next(null);
  }

  openAddVideoPopup() {
    this.addVideoPopupStatus.next(true);
  }

  closeAddVideoPopup() {
    this.addVideoPopupStatus.next(false);
  }
}
