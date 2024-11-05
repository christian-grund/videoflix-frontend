import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { environment } from '../../../environments/environment';

interface ConversionStatusResponse {
  '360p_status': string;
  '720p_status': string;
  '1080p_status': string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  public basePath = environment.apiUrl + 'media/thumbnails/';
  public categories: any[] = [];
  videoName: string = '';

  convertionProgress: number = 0;
  convertionFinished: boolean = false;

  constructor(private dataService: DataService, private videoPopupService: VideoPopupService) {}

  ngOnInit() {
    this.subscribeVideoName();
    this.loadConversionStatusFromStorage();
    this.subscribeVideoData();
  }

  /**
   * Subscribes to the video data stream and updates categories when data is received.
   */
  subscribeVideoData() {
    this.dataService.videoData$.subscribe((videoData) => {
      if (videoData.length > 0) {
        this.updateCategories(videoData);
      }
    });
  }

  /**
   * Subscribes to the conversion check stream to monitor the status of a specific video.
   */
  subscribeVideoName() {
    this.dataService.conversionCheck$.subscribe((videoName: string) => {
      if (videoName) {
        this.videoName = videoName;
        localStorage.setItem('currentVideoName', this.videoName);

        this.loadConversionStatusFromStorage();
        this.checkConvertionStatus(videoName);
      } else {
        this.loadVideoNameFromStorage();
      }
    });
  }

  /**
   * Loads the current video name from local storage and assigns it to the videoName property.
   */
  loadVideoNameFromStorage() {
    const storedVideoName = localStorage.getItem('currentVideoName');
    if (storedVideoName) {
      this.videoName = storedVideoName;
    }
  }

  /**
   * Loads the conversion status for the current video from local storage.
   * If the videoName is available, it retrieves the corresponding conversion status
   * and updates the conversionProgress and convertionFinished properties.
   * If the videoName is not available, it retries after 100 milliseconds.
   */
  loadConversionStatusFromStorage() {
    if (this.videoName) {
      const storedStatus = localStorage.getItem(`conversionStatus_${this.videoName}`);
      if (storedStatus) {
        const parsedStatus = JSON.parse(storedStatus);
        this.convertionProgress = parsedStatus.progress || 0;
        this.convertionFinished = parsedStatus.finished || false;

        if (!this.convertionFinished) {
          this.checkConvertionStatus(this.videoName);
        }
      }
    } else {
      setTimeout(() => this.loadConversionStatusFromStorage(), 100);
    }
  }

  /**
   * Updates the categories based on the provided video data, organizing videos into their respective categories.
   * @param {any[]} videoData - The array of video data to categorize.
   */
  updateCategories(videoData: any[]): void {
    const categoryMap: { [key: string]: { title: string; videos: any[] } } = {};

    videoData.forEach((video: { name: string; categories: string[] }) => {
      video.categories.forEach((category) => {
        if (!categoryMap[category]) {
          categoryMap[category] = { title: category, videos: [] };
        }
        categoryMap[category].videos.push(video);
      });
    });

    this.categories = Object.values(categoryMap);
  }

  /**
   * Opens a video information popup for the specified video.
   * @param {string} videoName - The name of the video to display information for.
   */
  openVideoInfo(videoName: string) {
    this.videoPopupService.openVideoPopup(videoName);
  }

  /**
   * Initializes the conversion status reset and starts monitoring the conversion progress for a specific video.
   * @param {string} videoName - The name of the video whose conversion status is being checked.
   */
  checkConvertionStatus(videoName: string) {
    this.resetConvertionStatus();

    const interval = setInterval(() => {
      this.checkConvertionProgress(videoName, interval);
    }, 500);
  }

  /**
   * Resets the conversion progress and completion status to their initial values.
   */
  resetConvertionStatus() {
    this.convertionProgress = 0;
    this.convertionFinished = false;
  }

  /**
   * Checks the conversion progress of a specific video and invokes the appropriate response handling.
   * @param {string} videoName - The name of the video to check conversion progress for.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the conversion status.
   */
  checkConvertionProgress(videoName: string, interval: NodeJS.Timeout) {
    const storedStatus = localStorage.getItem(`conversionStatus_${videoName}`);
    if (storedStatus) {
      this.handleConvertionResponse(JSON.parse(storedStatus), null);
    }

    this.dataService.loadConvertionStatus(videoName).subscribe({
      next: (response) => this.handleConvertionResponse(response, interval),
      error: (error) => this.handleConvertionError(error, interval),
    });
  }

  /**
   * Handles the response from the conversion status check and updates the conversion progress.
   * @param {any} response - The response containing the conversion status.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the conversion status.
   */
  handleConvertionResponse(response: any, interval: NodeJS.Timeout | null) {
    const convertedResponse = response as ConversionStatusResponse;
    this.updateConvertionProgress(convertedResponse);

    if (this.isConvertionComplete(convertedResponse)) {
      this.convertionFinished = true;

      if (interval) {
        clearInterval(interval);
      }

      localStorage.removeItem(`conversionStatus_${this.videoName}`);
      localStorage.removeItem('currentVideoName');
    }
  }

  /**
   * Updates the conversion progress based on the conversion status response.
   * @param {ConversionStatusResponse} response - The response containing conversion status information.
   */
  updateConvertionProgress(response: ConversionStatusResponse) {
    if (response['360p_status'] === 'completed') this.convertionProgress = 33;
    if (response['720p_status'] === 'completed') this.convertionProgress = 67;
    if (response['1080p_status'] === 'completed') this.convertionProgress = 100;

    localStorage.setItem(
      `conversionStatus_${this.videoName}`,
      JSON.stringify({
        videoName: this.videoName,
        progress: this.convertionProgress,
        finished: this.convertionFinished,
      })
    );
  }

  /**
   * Checks if the conversion is complete for all specified resolutions.
   * @param {ConversionStatusResponse} response - The response containing conversion status information.
   * @returns {boolean} True if conversion is complete; otherwise, false.
   */
  isConvertionComplete(response: ConversionStatusResponse): boolean {
    const isComplete = response['360p_status'] === 'completed' && response['720p_status'] === 'completed' && response['1080p_status'] === 'completed';
    return isComplete;
  }

  /**
   * Handles any errors that occur during the conversion status check and clears the interval.
   * @param {any} error - The error object containing error information.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the conversion status.
   */
  handleConvertionError(response: any, interval: NodeJS.Timeout | null) {
    this.updateConvertionProgress(response);

    if (this.isConvertionComplete(response)) {
      this.convertionFinished = true;
      localStorage.removeItem(`conversionStatus_${this.videoName}`);
      localStorage.removeItem('currentVideoName');
      if (interval) {
        clearInterval(interval);
      }
    }
  }
}
