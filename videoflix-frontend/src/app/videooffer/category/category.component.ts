import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { VideoPopupService } from '../../shared/services/videopopup.service';

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
  public basePath = 'http://localhost:8000/media/thumbnails/';
  public categories: any[] = [];
  videoName: string = '';

  convertionProgress: number = 0;
  convertionFinished: boolean = false;

  constructor(private dataService: DataService, private videoPopupService: VideoPopupService) {}

  ngOnInit() {
    this.subscribeVideoData();
    this.subscribeVideoName();
  }

  subscribeVideoData() {
    this.dataService.videoData$.subscribe((videoData) => {
      if (videoData.length > 0) {
        this.updateCategories(videoData);
      }
    });
  }

  subscribeVideoName() {
    this.dataService.conversionCheck$.subscribe((videoName: string) => {
      if (videoName) {
        this.checkConvertionStatus(videoName);
        this.videoName = videoName;
      }
    });
  }

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

  openVideoInfo(videoName: string) {
    this.videoPopupService.openVideoPopup(videoName);
  }

  checkConvertionStatus(videoName: string) {
    this.resetConvertionStatus;
    const interval = setInterval(() => {
      this.checkConvertionProgress(videoName, interval);
    }, 500);
  }

  resetConvertionStatus() {
    this.convertionProgress = 0;
    this.convertionFinished = false;
  }


  checkConvertionProgress(videoName: string, interval: NodeJS.Timeout) {
    this.dataService.loadConvertionStatus(videoName).subscribe({
      next: (response) => this.handleConvertionResponse(response, interval),
      error: (error) => this.handleConvertionError(error, interval),
    });
  }

  handleConvertionResponse(response: any, interval: NodeJS.Timeout) {
    const convertedResponse = response as unknown as ConversionStatusResponse;
    this.updateConvertionProgress(convertedResponse);

    if (this.isConvertionComplete(convertedResponse)) {
      this.convertionFinished = true;
      clearInterval(interval);
    }
  }

  updateConvertionProgress(response: ConversionStatusResponse) {
    if (response['360p_status'] === 'completed') this.convertionProgress = 33;
    if (response['720p_status'] === 'completed') this.convertionProgress = 67;
    if (response['1080p_status'] === 'completed') this.convertionProgress = 100;
  }

  isConvertionComplete(response: ConversionStatusResponse): boolean {
    return response['360p_status'] === 'completed' &&
    response['720p_status'] === 'completed' &&
    response['1080p_status'] === 'completed';
  }

  handleConvertionError(error: any, interval: NodeJS.Timeout) {
    console.error('Fehler beim Überprüfen des Convertion-Status:', error);
    clearInterval(interval);
  }
}
