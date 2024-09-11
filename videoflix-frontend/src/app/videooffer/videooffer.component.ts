import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>;
  selectedVideo: string | null = null;
  previewVideo: any;
  isPlaying = false;
  isVideoEnded = false;
  isMuted = false;
  videoData: {
    name: string;
    title: string;
    description: string;
    categories: any[];
  } | null = null;

  thumbBasePath = '../../assets/img/thumbnails/';
  videoBasePath = '../../assets/video/';
  iconBasePath = '../../assets/img/icons/';

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

    this.previewVideo = this.dataService.getVideoByName('breakout');
    this.closePopup();
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

  isFavorite(): boolean {
    return this.videoData?.categories.includes('Favorites') ?? false;
  }

  addToOrRemoveFromFavorites() {
    if (this.videoData) {
      const favoriteIndex = this.videoData.categories.indexOf('Favorites');

      if (favoriteIndex === -1) {
        this.videoData.categories.push('Favorites');
        console.log(
          `${this.videoData.name} wurde zu den Favoriten hinzugefügt.`
        );
      } else {
        this.videoData.categories.splice(favoriteIndex, 1);
        console.log(`${this.videoData.name} wurde aus den Favoriten entfernt.`);
      }
      this.dataService.updateVideoCategories(
        this.videoData.name,
        this.videoData.categories
      );
    }
  }

  playVideo() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.play();
  }

  pauseVideo() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.pause();
  }

  replayVideo() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.currentTime = 0;
    videoPlayer.play();
  }
}
