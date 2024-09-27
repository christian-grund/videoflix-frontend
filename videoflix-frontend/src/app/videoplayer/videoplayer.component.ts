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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  videoName!: string;
  videoResolution: string = '_720p';
  videoData: any;
  intervalId: any;
  isPlaying = false;
  isVideoEnded = false;
  isMuted = false;
  isFullscreen = false;
  isHovering = false;
  isNoSoundTextVisible = false;
  isResolutionMenuVisible = false;
  isVolumeSliderVisible = false;
  hasSound = false;
  videoDuration: number = 0;
  currentTime1: number = 0;
  progress: number = 0;
  hoverProgress = 0;
  currentVolume: number = 0.5;
  selectedResolution: number = 720;
  timeInSeconds: number = 0;
  timeOver: number = 3;
  isHeaderVisible = false;
  resolutions = [360, 720, 1080];
  // videoBasePath = '../../assets/video/';
  videoBasePath = 'http://localhost:8000/media/videos/';
  iconBasePath = '../../assets/img/icons/videoplayer/';

  private animationFrameId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // const token = localStorage.getItem('token');
    const token = '907395f03c73038f77baf0dab199fbb2bc35459a';
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    await this.dataService.loadVideoData(headers);

    this.route.paramMap.subscribe((params) => {
      this.videoName = params.get('videoname')!;
    });

    this.dataService.videoData$.subscribe((videoData) => {
      if (videoData && videoData.length > 0) {
        this.videoData = this.dataService.getVideoByName(this.videoName);

        if (!this.videoData) {
          console.error('Video not found!');
        }
      }
    });

    console.log('videoData:', this.videoData);
  }

  // getHttpHeaders() {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

  //   return headers;
  // }

  skip(seconds: number) {
    console.log('skip was called!');
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime = seconds;
    // video.currentTime = 5;
    console.log('skip video.currentTime:', video.currentTime);

    // const newTime = video.currentTime + seconds;

    // if (newTime < 0) {
    //   video.currentTime = 0;
    // } else if (newTime > video.duration) {
    //   video.currentTime = video.duration;
    //   console.log('skip video.currentTime:', video.currentTime);
    // } else {
    //   video.currentTime = newTime;
    //   console.log('skip video.currentTime:', video.currentTime);
    // }
  }

  ngAfterViewInit() {
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;

      video.addEventListener('canplay', () => {
        this.skip(5); // Beispiel, um nach 5 Sekunden zu springen
        console.log('Vaslkjfklsdfj:', this.videoDuration);
      });

      video.addEventListener('loadedmetadata', () => {
        // Hier kannst du sicher auf currentTime zugreifen
        this.skip(5); // Beispiel, um nach 5 Sekunden zu springen
        console.log('Video metadata loaded, duration:', this.videoDuration);
      });

      //   const videoPlayer = this.videoPlayer.nativeElement;
      // videoPlayer.addEventListener('loadedmetadata', () => {
      //   this.videoDuration = videoPlayer.duration;
      //   console.log('Video metadata loaded, duration:', this.videoDuration);
      //   this.cdr.detectChanges();
      //   // setTimeout(() => {
      //   // }, 100);
      // });
      // videoPlayer.addEventListener('canplaythrough', () => {
      //   if (this.videoDuration === 0) {
      //     this.videoDuration = videoPlayer.duration;
      //     console.log('canplaythrough - videoDuration:', this.videoDuration);
      //     this.cdr.detectChanges();
      //   }
      // });
      // videoPlayer.addEventListener('timeupdate', () => {
      //   this.currentTime = videoPlayer.currentTime;
      //   this.cdr.detectChanges();
      // });
      // videoPlayer.addEventListener('fullscreenchange', () => {
      //   this.isFullscreen = !!document.fullscreenElement;
      //   this.updateControlsVisibility();
      // });
    }
  }

  onMetadataLoaded() {
    if (this.videoPlayer) {
      this.videoDuration = this.videoPlayer.nativeElement.duration;
      console.log('Video metadata loaded, duration:', this.videoDuration);
      setTimeout(() => {
        this.skip(5);
      }, 1000);
    }
  }

  onTimeUpdate() {
    // if (this.videoPlayer) {
    //   this.currentTime = this.videoPlayer.nativeElement.currentTime;
    // }
  }

  startTimer() {
    // if (this.intervalId) {
    //   this.stopTimer();
    // }
    // this.isHeaderVisible = true;
    // this.intervalId = setInterval(() => {
    //   this.timeInSeconds++;
    //   if (this.timeInSeconds >= this.timeOver) {
    //     this.resetTimer();
    //     this.isHeaderVisible = false;
    //   }
    // }, 1000);
  }

  stopTimer() {
    // if (this.intervalId) {
    //   clearInterval(this.intervalId);
    //   this.intervalId = null;
    // }
  }

  resetTimer() {
    // this.stopTimer();
    // this.timeInSeconds = 0;
  }

  setHeaderVisible() {
    // this.isHeaderVisible = true;
    // console.log('setHeaderVisible');
  }

  startUpdatingProgress() {
    // this.updateProgress();
  }

  stopUpdatingProgress() {
    // if (typeof cancelAnimationFrame !== 'undefined') {
    //   cancelAnimationFrame(this.animationFrameId);
    // }
  }

  updateProgress() {
    // const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    // if (video.duration) {
    //   this.progress = (video.currentTime / video.duration) * 100;
    // }
    // if (typeof requestAnimationFrame !== 'undefined') {
    //   this.animationFrameId = requestAnimationFrame(() =>
    //     this.updateProgress()
    //   );
    // }
  }

  seek(event: MouseEvent) {
    // const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    // const progressContainer = event.currentTarget as HTMLElement;
    // if (video.duration) {
    //   const rect = progressContainer.getBoundingClientRect();
    //   const clickPosition = event.clientX - rect.left;
    //   const percentage = clickPosition / rect.width;
    //   console.log('video.duration:', video.duration);
    //   console.log('percentage:', percentage);
    //   video.currentTime = video.duration * percentage;
    //   // video.currentTime = 5;
    //   console.log('seek progress bar - video.currentTime:', video.currentTime);
    // }
  }

  onMouseMove(event: MouseEvent) {
    // const progressContainer = event.currentTarget as HTMLElement;
    // const rect = progressContainer.getBoundingClientRect();
    // const hoverPosition = event.clientX - rect.left;
    // this.hoverProgress = (hoverPosition / rect.width) * 100;
    // this.isHovering = true;
  }

  resetHover() {
    // this.isHovering = false;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy() {
    // if (typeof cancelAnimationFrame !== 'undefined') {
    //   cancelAnimationFrame(this.animationFrameId);
    // }
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
    // this.isVolumeSliderVisible = !this.isVolumeSliderVisible;
    // this.isNoSoundTextVisible = !this.isNoSoundTextVisible;
  }

  setVolume(event: Event) {
    // const videoPlayer = this.videoPlayer.nativeElement;
    // const inputElement = event.target as HTMLInputElement;
    // videoPlayer.volume = parseFloat(inputElement.value);
    // this.currentVolume = videoPlayer.volume;
    // if (this.currentVolume == 0) {
    //   this.isMuted = true;
    // } else {
    //   this.isMuted = false;
    // }
  }

  toggleFullscreen() {
    // const videoContainer = document.querySelector(
    //   '.video-container'
    // ) as HTMLElement;
    // if (document.fullscreenElement) {
    //   document.exitFullscreen();
    // } else {
    //   videoContainer
    //     .requestFullscreen()
    //     .then(() => {
    //       // Optional: Update the controls visibility or any other logic after entering fullscreen
    //       this.updateControlsVisibility();
    //     })
    //     .catch((err) => {
    //       console.error('Failed to enter fullscreen mode:', err);
    //     });
    // }
  }

  updateControlsVisibility() {
    // const controls = document.querySelector('.controls') as HTMLElement;
    // if (controls) {
    //   controls.style.display = 'flex'; // Ensure the custom controls are always visible
    // }
  }

  onVideoEnded() {
    // this.isVideoEnded = true;
    // this.isPlaying = false;
  }

  toggleResolutionMenu() {
    // this.isResolutionMenuVisible = !this.isResolutionMenuVisible;
  }

  setResolution(resolution: number) {
    // this.selectedResolution = resolution;
    // this.videoResolution = `_${resolution}p`;
  }
}
