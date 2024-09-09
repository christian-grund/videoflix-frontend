import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  // @ViewChild('progressBar') progressBar!: ElementRef<HTMLInputElement>;
  progressBarWidth: string = '0%';
  videoname!: string;
  videoData: any;
  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  videoDuration: number = 0;
  currentTime: number = 0;
  progressTime: string = '';
  progress: number = 0;
  hoverProgress = 0;
  hovering = false;
  videoBasePath = '../../assets/video/';
  iconBasePath = '../../assets/img/icons/videoplayer/';

  private animationFrameId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.videoname = params.get('videoname')!;
      this.videoData = this.dataService.getVideoByName(this.videoname);

      if (!this.videoData) {
        console.error('Video not found!');
      } else {
        console.log('Video data:', this.videoData);
      }
    });
  }

  startUpdatingProgress() {
    this.updateProgress();
  }

  stopUpdatingProgress() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  updateProgress() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (video.duration) {
      this.progress = (video.currentTime / video.duration) * 100;
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(() =>
        this.updateProgress()
      );
    }
  }

  // Benutzer hat auf die Fortschrittsleiste geklickt
  seek(event: MouseEvent) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    const progressContainer = event.currentTarget as HTMLElement;

    // Überprüfe, ob das Video bereits geladen ist und eine Dauer hat
    if (video.duration) {
      // Position des Klicks relativ zur Fortschrittsleiste berechnen
      const rect = progressContainer.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const percentage = clickPosition / rect.width;

      // Setze den aktuellen Zeitpunkt des Videos basierend auf der prozentualen Position
      video.currentTime = video.duration * percentage;
    }
  }

  // Maus bewegt sich über die Fortschrittsleiste
  onMouseMove(event: MouseEvent) {
    const progressContainer = event.currentTarget as HTMLElement;
    const rect = progressContainer.getBoundingClientRect();
    const hoverPosition = event.clientX - rect.left;
    this.hoverProgress = (hoverPosition / rect.width) * 100;
    this.hovering = true;
  }

  // Maus hat die Fortschrittsleiste verlassen
  resetHover() {
    this.hovering = false;
  }

  playVideo() {
    this.videoPlayer.nativeElement.play();
    this.isPlaying = true;
    // this.startUpdatingProgress();
  }

  pauseVideo() {
    this.videoPlayer.nativeElement.pause();
    this.isPlaying = false;
    // if (this.updateIntervalId !== null) {
    //   clearInterval(this.updateIntervalId);
    //   this.updateIntervalId = null;
    // }
  }

  ngOnDestroy() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // ngAfterViewInit() {
  //   const video = this.videoPlayer.nativeElement;
  //   video.onloadedmetadata = () => {
  //     this.videoDuration = video.duration || 0;
  //   };
  // }

  // ngOnDestroy() {
  //   if (this.updateIntervalId !== null) {
  //     clearInterval(this.updateIntervalId);
  //   }
  // }

  // updateProgress() {
  //   const video = this.videoPlayer.nativeElement;
  //   if (video) {
  //     this.currentTime = video.currentTime || 0;
  //     this.videoDuration = video.duration || 0;
  //     this.progressBar.nativeElement.value = this.currentTime.toString(); // Umwandlung in String
  //     console.log(
  //       `Current Time: ${this.currentTime}, Duration: ${this.videoDuration}`
  //     );
  //   }
  // }

  // private startUpdatingProgress() {
  //   if (this.isPlaying && this.updateIntervalId === null) {
  //     this.updateIntervalId = window.setInterval(() => {
  //       this.updateProgress();
  //     }, 10); // Update alle 10 Millisekunden
  //   }
  // }

  // seek(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const newTime = parseFloat(input.value);
  //   this.videoPlayer.nativeElement.currentTime = newTime;
  // }

  // formatTime(seconds: number): string {
  //   const minutes = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  // }

  // onVideoEnded() {
  //   this.isPlaying = false;
  //   if (this.updateIntervalId !== null) {
  //     clearInterval(this.updateIntervalId);
  //     this.updateIntervalId = null;
  //   }
  // }
}
// ngAfterViewInit() {
//   if (this.videoPlayerRef) {
//     const videoPlayer = this.videoPlayerRef.nativeElement;

//     videoPlayer.addEventListener('loadedmetadata', () => {
//       this.videoDuration = videoPlayer.duration;
//       console.log('Video Duration:', this.videoDuration);
//     });

//     videoPlayer.addEventListener('timeupdate', async () => {
//       this.currentTime = videoPlayer.currentTime;

//       // Update the progress bar
//       await this.updateProgressBar();
//       console.log('currentTime:', this.currentTime);
//       // console.log('videoDuration:', this.videoDuration);
//     });
//   }
// }

// private async updateProgressBar() {
//   this.progress = (this.currentTime / this.videoDuration) * 100;

//   while (this.progress <= 100) {
//     await this.sleep(this.default_ms);
//     this.progress = (this.currentTime / this.videoDuration) * 100;
//   }

//   // console.log('Progres:', this.progress);
// }

// private sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// playPause() {
//   const videoPlayer = this.videoPlayerRef.nativeElement;

//   if (videoPlayer.paused) {
//     videoPlayer.play();
//     this.isPlaying = true;
//   } else {
//     videoPlayer.pause();
//     this.isPlaying = false;
//   }
// }

// seek(event: any) {
//   const videoPlayer = this.videoPlayerRef.nativeElement;
//   videoPlayer.currentTime = event.target.value;
//   this.currentTime = videoPlayer.currentTime;
// }

// toggleMute() {
//   const videoPlayer = this.videoPlayerRef.nativeElement;
//   videoPlayer.muted = !videoPlayer.muted;
//   this.isMuted = videoPlayer.muted;
// }
