import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CategoryComponent } from './category/category.component';
import { VideoPopupService } from '../shared/services/videopopup.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CategoryComponent, CommonModule],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent implements OnInit {
  selectedVideo: string | null = null;
  videoData: {
    name: string;
    title: string;
    description: string;
    categories: any[];
  } | null = null;

  basePathThumb = './../../../assets/img/thumbnails/';

  constructor(
    private videoPopupService: VideoPopupService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideo = videoName;

      if (this.selectedVideo) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    });
  }

  openPopup() {
    if (this.selectedVideo) {
      this.videoData =
        this.dataService.getVideoByName(this.selectedVideo) || null;
    }
  }

  closePopup() {
    this.selectedVideo = null;
    this.videoData = null;
  }

  openVideo(videoName: string) {
    if (videoName) {
      this.router.navigate([`/videos/watch/${videoName}`]);
    }
  }
}
