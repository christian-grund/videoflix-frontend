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

  /**
   * Subscribes to the video counter updates from the video popup service.
   * When the triggerCountVideos event occurs, it calls the countUserUploadedVideos method.
   */
  subscribeVideoCounter() {
    this.subscriptions.add(
      this.videoPopupService.triggerCountVideos$.subscribe(() => {
        this.countUserUploadedVideos();
      })
    );
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  /**
   * Handles the selection of a video file from the input element.
   * Updates the selectedFile property and checks the file size.
   *
   * @param {Event} event - The change event from the file input.
   */
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.fileInserted = true;
      if (this.selectedFile.size <= 26214400) {
        this.fileSizeError = false;
      } else {
        this.fileSizeError = true;
      }
    } else {
      this.fileInserted = false;
    }
  }

  /**
   * Uploads the selected video to the backend.
   * Validates the upload conditions and sends the video data.
   */
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

  /**
   * Checks if the upload conditions are valid.
   *
   * @returns {boolean} True if the selected file is valid and the user has not exceeded the upload limit, false otherwise.
   */
  isUploadValid() {
    return this.selectedFile && this.selectedFile.size <= 26214400 && this.userVideoCounter <= 3;
  }

  /**
   * Retrieves the name of the selected video file without the file extension.
   *
   * @returns {string} The name of the video file.
   */
  getVideoName() {
    return (this.selectedFile?.name ?? '').replace('.mp4', '');
  }

  /**
   * Creates a FormData object containing the video upload information.
   *
   * @returns {FormData | null} The FormData object if a file is selected; otherwise, null.
   */
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

  /**
   * Checks the status of the video's thumbnail generation at regular intervals.
   */
  checkThumbnailStatus() {
    const interval = setInterval(() => {
      this.dataService.loadThumbnailStatus(this.videoName).subscribe({
        next: (response) => {
          if (response.status === 'completed') {
            this.handleThumbnailResponse(interval);
          }
        },
        error: (error) => {
          this.handleThumbnailError(error, interval);
        },
      });
    }, 500);
  }

  /**
   * Handles the successful response of the thumbnail status check.
   * Stops the interval, reloads video data, and triggers video conversion.
   *
   * @param {any} interval - The interval ID for clearing the interval.
   */
  handleThumbnailResponse(interval: any) {
    clearInterval(interval);
    setTimeout(() => {
      this.dataService.loadVideoData(this.dataService.getAuthHeaders());
    }, 1000);
    this.isLoading = false;
    this.closeAddVideoPopup();
    this.dataService.triggerConvertionCheck(this.videoName);
  }

  /**
   * Handles errors during the thumbnail status check.
   *
   * @param {any} error - The error object from the failed request.
   * @param {any} interval - The interval ID for clearing the interval.
   */
  handleThumbnailError(error: any, interval: any) {
    console.error('Fehler beim Überprüfen des Thumbnail-Status:', error);
    clearInterval(interval);
  }

  /**
   * Counts the number of videos uploaded by the user.
   * Updates the userVideoCounter property based on the data retrieved from the data service.
   */
  countUserUploadedVideos() {
    const data = this.dataService.getData();
    this.userVideoCounter = 0;
    data.forEach((item) => {
      if (item.user !== null) {
        this.userVideoCounter++;
      }
    });
  }

  /**
   * Closes the video upload popup and resets the user video counter.
   */
  closeAddVideoPopup() {
    this.videoPopupService.closeAddVideoPopup();
    this.userVideoCounter = 0;
  }
}
