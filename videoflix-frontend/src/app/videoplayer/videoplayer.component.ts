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
export class VideoplayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  videoname!: string;
  videoData: any;
  isPlaying = false;
  isVideoEnded = false;
  isMuted = false;
  isFullscreen = false;
  isResolutionMenuVisible = false;
  isVolumeSliderVisible = false;
  videoDuration: number = 0;
  currentTime: number = 0;
  progress: number = 0;
  hoverProgress = 0;
  hovering = false;

  currentVolume: number = 0.5;
  currentResolution: number = 720;
  videoBasePath = '../../assets/video/';
  iconBasePath = '../../assets/img/icons/videoplayer/';

  private animationFrameId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.videoname = params.get('videoname')!;
      this.videoData = this.dataService.getVideoByName(this.videoname);

      if (!this.videoData) {
        console.error('Video not found!');
      }
    });
  }

  ngAfterViewInit() {
    if (this.videoPlayer) {
      const videoPlayer = this.videoPlayer.nativeElement;

      videoPlayer.addEventListener('loadedmetadata', () => {
        this.videoDuration = videoPlayer.duration;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.videoDuration = videoPlayer.duration;
          this.cdr.detectChanges();
        }, 1000);
      });

      videoPlayer.addEventListener('canplaythrough', () => {
        if (this.videoDuration === 0) {
          this.videoDuration = videoPlayer.duration;
          this.cdr.detectChanges();
        }
      });

      videoPlayer.addEventListener('timeupdate', () => {
        this.currentTime = videoPlayer.currentTime;
        this.cdr.detectChanges();
      });

      videoPlayer.addEventListener('fullscreenchange', () => {
        this.isFullscreen = !!document.fullscreenElement;
        this.updateControlsVisibility();
      });
    }
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

  seek(event: MouseEvent) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    const progressContainer = event.currentTarget as HTMLElement;

    if (video.duration) {
      const rect = progressContainer.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const percentage = clickPosition / rect.width;

      video.currentTime = video.duration * percentage;
    }
  }

  onMouseMove(event: MouseEvent) {
    const progressContainer = event.currentTarget as HTMLElement;
    const rect = progressContainer.getBoundingClientRect();
    const hoverPosition = event.clientX - rect.left;
    this.hoverProgress = (hoverPosition / rect.width) * 100;
    this.hovering = true;
  }

  resetHover() {
    this.hovering = false;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  playPause() {
    const videoPlayer = this.videoPlayer.nativeElement;

    if (videoPlayer.paused) {
      videoPlayer.play();
      this.isPlaying = true;
      this.isVideoEnded = false;
    } else {
      videoPlayer.pause();
      this.isPlaying = false;
    }
  }

  toggleVolumeSlider() {
    this.isVolumeSliderVisible = !this.isVolumeSliderVisible;
  }

  setVolume(event: Event) {
    const videoPlayer = this.videoPlayer.nativeElement;
    const inputElement = event.target as HTMLInputElement;

    videoPlayer.volume = parseFloat(inputElement.value);
    this.currentVolume = videoPlayer.volume;

    if (this.currentVolume == 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
  }

  toggleFullscreen() {
    const videoContainer = document.querySelector(
      '.video-container'
    ) as HTMLElement;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainer
        .requestFullscreen()
        .then(() => {
          // Optional: Update the controls visibility or any other logic after entering fullscreen
          this.updateControlsVisibility();
        })
        .catch((err) => {
          console.error('Failed to enter fullscreen mode:', err);
        });
    }
  }

  updateControlsVisibility() {
    const controls = document.querySelector('.controls') as HTMLElement;
    if (controls) {
      controls.style.display = 'flex'; // Ensure the custom controls are always visible
    }
  }

  skip(seconds: number) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;

    const newTime = video.currentTime + seconds;

    if (newTime < 0) {
      video.currentTime = 0;
    } else if (newTime > video.duration) {
      video.currentTime = video.duration;
    } else {
      video.currentTime = newTime;
    }
  }

  onVideoEnded() {
    this.isVideoEnded = true;
    this.isPlaying = false;
  }

  toggleResolutionMenu() {
    this.isResolutionMenuVisible = !this.isResolutionMenuVisible;
  }

  setResolution(resolution: number) {
    this.currentResolution = resolution;
    console.log(`The Resolution was set to ${resolution}px.`);

    this.isResolutionMenuVisible = false;
  }
}
