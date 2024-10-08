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

  // private addVideoPopupStatus = new BehaviorSubject<boolean>(false);
  // addVideoPopupStatus$ = this.addVideoPopupStatus.asObservable();

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

  openEditVideoPopup(videoName: string) {
    this.editVideoNameSubject.next(videoName);
    console.log('editVideoNameSubject:', this.editVideoNameSubject);
  }

  closeEditVideoPopup() {
    this.editVideoNameSubject.next(null);
  }

  // openEditVideoPopup() {
  //   this.editVideoPopupStatus.next(true);
  // }

  // closeEditVideoPopup() {
  //   this.editVideoPopupStatus.next(false);
  // }
}
