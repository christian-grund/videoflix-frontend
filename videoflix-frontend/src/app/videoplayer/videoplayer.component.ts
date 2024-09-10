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
  videoDuration: number = 0;
  currentTime: number = 0;
  progress: number = 0;
  hoverProgress = 0;
  hovering = false;
  videoBasePath = '../../assets/video/';
  iconBasePath = '../../assets/img/icons/videoplayer/';

  private animationFrameId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
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

  ngAfterViewInit() {
    if (this.videoPlayer) {
      const videoPlayer = this.videoPlayer.nativeElement;

      // Event-Listener für 'loadedmetadata'
      videoPlayer.addEventListener('loadedmetadata', () => {
        this.videoDuration = videoPlayer.duration;
        this.cdr.detectChanges(); // Force Angular change detection
        console.log('Video Duration (loadedmetadata):', this.videoDuration);

        // Verzögertes Setzen von videoDuration
        setTimeout(() => {
          this.videoDuration = videoPlayer.duration;
          this.cdr.detectChanges(); // Force Angular change detection
          console.log('Video Duration (after delay):', this.videoDuration);
        }, 1000);
      });

      // Event-Listener für 'canplaythrough'
      videoPlayer.addEventListener('canplaythrough', () => {
        if (this.videoDuration === 0) {
          this.videoDuration = videoPlayer.duration;
          this.cdr.detectChanges(); // Force Angular change detection
          console.log('Video Duration (canplaythrough):', this.videoDuration);
        }
      });

      // Event-Listener für 'timeupdate'
      videoPlayer.addEventListener('timeupdate', () => {
        this.currentTime = videoPlayer.currentTime;
        this.cdr.detectChanges(); // Force Angular change detection
        console.log('Video currentTime:', this.currentTime);
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

  toggleMute() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.muted = !videoPlayer.muted;
    this.isMuted = videoPlayer.muted;
  }

  toggleFullscreen() {
    const videoPlayer = this.videoPlayer.nativeElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoPlayer.requestFullscreen();
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
}
