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

  is360pConverted: boolean = true;
  is720pConverted: boolean = false;
  is1080pConverted: boolean = false;
  convertionFinished: boolean = false;

  constructor(private dataService: DataService, private videoPopupService: VideoPopupService) {}

  ngOnInit() {
    this.dataService.videoData$.subscribe((videoData) => {
      if (videoData.length > 0) {
        this.updateCategories(videoData);
      }
    });

    this.dataService.conversionCheck$.subscribe((videoName: string) => {
      if (videoName) {
        this.checkConvertionStatus(videoName);
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
    console.log('videoName:', videoName);
    const interval = setInterval(() => {
      this.dataService.loadConvertionStatus(videoName).subscribe({
        next: (response) => {
          const convertedResponse = response as unknown as ConversionStatusResponse;
          console.log('Response:', convertedResponse);

          if (convertedResponse['360p_status'] === 'completed') {
            this.is360pConverted = true;
            console.log('360p Status:', convertedResponse['360p_status']);
          } else {
            this.is360pConverted = false;
          }

          if (convertedResponse['720p_status'] === 'completed') {
            this.is720pConverted = true;
            console.log('720p Status:', convertedResponse['720p_status']);
          } else {
            this.is720pConverted = false;
          }

          if (convertedResponse['1080p_status'] === 'completed') {
            this.is1080pConverted = true;
            console.log('1080p Status:', convertedResponse['1080p_status']);
          } else {
            this.is1080pConverted = false;
          }

          if (
            convertedResponse['360p_status'] === 'completed' &&
            convertedResponse['720p_status'] === 'completed' &&
            convertedResponse['1080p_status'] === 'completed'
          ) {
            this.convertionFinished = true;
            clearInterval(interval);
            console.log('convertionFinished');
          }
        },
        error: (error) => {
          console.error('Fehler beim Überprüfen des Convertion-Status:', error);
          clearInterval(interval);
        },
      });
    }, 500);
  }
}
