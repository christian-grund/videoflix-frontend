import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-addvideopopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addvideopopup.component.html',
  styleUrl: './addvideopopup.component.scss',
  encapsulation: ViewEncapsulation.None, //
})
export class AddvideopopupComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  videoTitle: string = '';
  videoName: string = '';
  videoDescription: string = '';
  userVideoCounter: number = 0;
  hasSound: boolean = false;
  isLoading: boolean = false;
  fileInserted: boolean = false;
  fileSizeError: boolean = false;
  selectedFile: File | null = null;

  iconBasePath = '../../../assets/img/icons/';

  constructor(private dataService: DataService, private videoPopupService: VideoPopupService, private http: HttpClient) {}

  ngOnInit(): void {
    this.subscribeVideoCounter();
  }

  subscribeVideoCounter() {
    this.subscriptions.add(
      this.videoPopupService.triggerCountVideos$.subscribe(() => {
        this.countUserUploadedVideos();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.fileInserted = true;
      if (this.selectedFile.size <= 52428800) {
        this.fileSizeError = false;
      } else {
        this.fileSizeError = true;
      }
    } else {
      this.fileInserted = false;
    }
  }

  async uploadVideo() {
    if (this.isUploadValid()) {
      this.isLoading = true;
      this.videoName = this.getVideoName();
      const uploadVideoData = this.createUploadData();

      try {
        await firstValueFrom(this.dataService.setVideosInBackend(uploadVideoData!));
        this.checkThumbnailStatus();
      } catch (error) {
        console.error('Fehler beim Hochladen des Videos oder der Statusüberprüfung:', error);
      } finally {
        this.isLoading = false;
      }
      this.fileSizeError = false;
    } else {
      this.fileSizeError = true;
    }
  }

  isUploadValid() {
    return this.selectedFile && this.selectedFile.size <= 52428800 && this.userVideoCounter <= 3;
  }

  getVideoName() {
    return (this.selectedFile?.name ?? '').replace('.mp4', '');
  }

  createUploadData() {
    if (!this.selectedFile) {
      return null; 
    }
    const uploadVideoData = new FormData();
      uploadVideoData.append('name', this.videoName);
      uploadVideoData.append('title', this.videoTitle);
      uploadVideoData.append('description', this.videoDescription);
      uploadVideoData.append('categories', 'My Videos');
      uploadVideoData.append('video_file', this.selectedFile, this.selectedFile.name);
      return uploadVideoData;
  }

  checkThumbnailStatus() {
    const interval = setInterval(() => {
      this.dataService.loadThumbnailStatus(this.videoName).subscribe({
        next: (response) => {
          if (response.status === 'completed') {
            this.handleThumbnailResponse(interval)
          }
        },
        error: (error) => {
          this.handleThumbnailError(error, interval)
        },
      });
    }, 500);
  }

  handleThumbnailResponse(interval: any) {
    clearInterval(interval);
    setTimeout(() => {this.dataService.loadVideoData(this.dataService.getAuthHeaders())}, 1000);
    this.isLoading = false;
    this.closeAddVideoPopup();
    this.dataService.triggerConvertionCheck(this.videoName);
  }

  handleThumbnailError(error: any, interval: any) {
    console.error('Fehler beim Überprüfen des Thumbnail-Status:', error);
    clearInterval(interval);
  }

  countUserUploadedVideos() {
    const data = this.dataService.getData();
    this.userVideoCounter = 0;
    data.forEach((item) => {
      if (item.user !== null) {
        this.userVideoCounter++;
      }
    });
  }

  closeAddVideoPopup() {
    this.videoPopupService.closeAddVideoPopup();
    this.userVideoCounter = 0;
  }
}
