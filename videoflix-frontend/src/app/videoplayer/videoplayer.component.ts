import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { VideoPopupService } from '../shared/services/videopopup.service';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  videoName!: string;
  videoResolution: string = '_720p';
  videoStartTime: number = 0;
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
  currentTime: number = 0;
  progress: number = 0;
  hoverProgress = 0;
  currentVolume: number = 0.5;
  selectedResolution: number = 720;
  timeInSeconds: number = 0;
  timeOver: number = 3;
  isHeaderVisible = false;
  resolutions = [360, 720, 1080];
  loading: boolean = false;
  videoBasePath = environment.apiUrl + 'media/videos/';
  iconBasePath = '../../assets/img/icons/videoplayer/';

  private animationFrameId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,

    private cdr: ChangeDetectorRef,
    private videoPopupService: VideoPopupService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.dataService.videoData$.subscribe(
      (videoData) => {
        if (videoData && videoData.length > 0) {
          console.log('videoData:', videoData);
        } else {
          console.log('Keine Videodaten gefunden!');
        }
      },
      (error) => {
        console.error('Fehler beim Abrufen der Videodaten:', error);
      }
    );
    await this.subscribeToRouteUrl();
    await this.loadData();
    this.getVideoData();

    this.closeOpenVideoPopup();
  }

  /**
   * Closes video popup
   */
  closeOpenVideoPopup() {
    this.videoPopupService.closeVideoPopup();
  }

  /**
   * Subscribes to the route parameters and retrieves the video name from the URL.
   */
  async subscribeToRouteUrl() {
    return new Promise<void>((resolve) => {
      this.route.paramMap.subscribe((params) => {
        this.videoName = params.get('videoname')!;
        console.log('videoName:', this.videoName);
        resolve(); // Sobald der videoName extrahiert ist, wird das Promise aufgelöst
      });
    });
  }

  /**
   * Loads video data from the data service using an authorization token from local storage,
   * but only if the platform is a browser.
   * @returns {Promise<void>} A promise that resolves when the video data is loaded.
   */
  async loadData() {
    if (isPlatformBrowser(this.platformId)) {
      const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
      await this.dataService.loadVideoData(headers);
    }
  }

  /**
   * Subscribes to video data changes and updates the local videoData property when new data is available.
   */
  getVideoData() {
    this.dataService.videoData$.subscribe((videoData) => {
      if (videoData && videoData.length > 0) {
        this.videoData = this.dataService.getVideoByName(this.videoName);
        console.log('getVideoData:', this.videoData);
      }
    });
  }

  /**
   * Lifecycle hook that runs after the view has been initialized.
   * Sets up event listeners for the video player.
   */
  ngAfterViewInit() {
    if (this.videoPlayer) {
      const videoPlayer = this.videoPlayer.nativeElement;

      this.onLoadedmetadata(videoPlayer);
      this.onCanPlayThrough(videoPlayer);
      this.onTimeUpdateEvent(videoPlayer);
      this.onFullscreenChange(videoPlayer);
    }
  }

  /**
   * Sets up an event listener for when video metadata is loaded,
   * updating the video duration and triggering change detection.
   * @param {HTMLVideoElement} videoPlayer - The video player element.
   */
  onLoadedmetadata(videoPlayer: any) {
    videoPlayer.addEventListener('loadedmetadata', () => {
      this.videoDuration = videoPlayer.duration;
      this.cdr.detectChanges();
      setTimeout(() => {}, 100);
    });
  }

  /**
   * Sets up an event listener for when the video can play through,
   * ensuring that the video duration is updated.
   * @param {HTMLVideoElement} videoPlayer - The video player element.
   */
  onCanPlayThrough(videoPlayer: any) {
    videoPlayer.addEventListener('canplaythrough', () => {
      if (this.videoDuration === 0) {
        this.videoDuration = videoPlayer.duration;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Sets up an event listener to update the current time of the video
   * as it plays.
   * @param {HTMLVideoElement} videoPlayer - The video player element.
   */
  onTimeUpdateEvent(videoPlayer: any) {
    videoPlayer.addEventListener('timeupdate', () => {
      this.currentTime = videoPlayer.currentTime;
      this.cdr.detectChanges();
    });
  }

  /**
   * Sets up an event listener for fullscreen changes and updates
   * the visibility of video controls accordingly.
   * @param {HTMLVideoElement} videoPlayer - The video player element.
   */
  onFullscreenChange(videoPlayer: any) {
    videoPlayer.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
      this.updateControlsVisibility();
    });
  }

  /**
   * Initializes the video player with the duration and sets the current time
   * based on the video start time, playing the video if necessary.
   */
  onMetadataLoaded() {
    if (this.videoPlayer) {
      this.videoDuration = this.videoPlayer.nativeElement.duration;
    }
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.currentTime = this.videoStartTime;
    if (this.isPlaying) {
      videoPlayer.play();
    }
  }

  /**
   * Updates the current time of the video player.
   */
  onTimeUpdate() {
    if (this.videoPlayer) {
      this.currentTime = this.videoPlayer.nativeElement.currentTime;
    }
  }

  /**
   * Starts a timer that updates the timeInSeconds every second,
   * and hides the header when the specified time is over.
   */
  startTimer() {
    if (this.intervalId) {
      this.stopTimer();
    }
    this.isHeaderVisible = true;
    this.intervalId = setInterval(() => {
      this.timeInSeconds++;
      if (this.timeInSeconds >= this.timeOver) {
        this.resetTimer();
        this.isHeaderVisible = false;
      }
    }, 1000);
  }

  /**
   * Stops the running timer, if any.
   */
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resets the timer to zero and stops it.
   */
  resetTimer() {
    this.stopTimer();
    this.timeInSeconds = 0;
  }

  /**
   * Sets the header visibility to true.
   */
  setHeaderVisible() {
    this.isHeaderVisible = true;
  }

  /**
   * Skips the video by a specified number of seconds.
   * @param {number} seconds - The number of seconds to skip.
   */
  skip(seconds: number) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.currentTime += seconds;

    const newTime = video.currentTime + seconds;

    if (newTime < 0) {
      video.currentTime = 0;
    } else if (newTime > video.duration) {
      video.currentTime = video.duration;
    } else {
      video.currentTime = newTime;
    }
  }

  /**
   * Starts updating the video progress.
   */
  startUpdatingProgress() {
    this.updateProgress();
  }

  /**
   * Stops updating the video progress.
   */
  stopUpdatingProgress() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Updates the progress percentage of the video based on current time and duration.
   */
  updateProgress() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    if (video.duration) {
      this.progress = (video.currentTime / video.duration) * 100;
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(() => this.updateProgress());
    }
  }

  /**
   * Seeks the video to a position based on a click event on the progress bar.
   * @param {MouseEvent} event - The mouse event used to calculate the new current time.
   */
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

  /**
   * Handles mouse movement over the progress container, updating the hover progress percentage.
   * @param {MouseEvent} event - The mouse event for tracking the hover position.
   */
  onMouseMove(event: MouseEvent) {
    const progressContainer = event.currentTarget as HTMLElement;
    const rect = progressContainer.getBoundingClientRect();
    const hoverPosition = event.clientX - rect.left;
    this.hoverProgress = (hoverPosition / rect.width) * 100;
    this.isHovering = true;
  }

  /**
   * Resets the hover state to false.
   */
  resetHover() {
    this.isHovering = false;
  }

  /**
   * Formats a given time in seconds to a string in the format "MM:SS".
   * @param {number} seconds - The time in seconds to format.
   * @returns {string} The formatted time as a string.
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Lifecycle hook that runs when the component is destroyed.
   * Stops any ongoing animation frames.
   */
  ngOnDestroy() {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Toggles play/pause state of the video player.
   */
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

  /**
   * Toggles the visibility of the volume slider and the no-sound text.
   */
  toggleVolumeSlider() {
    this.isVolumeSliderVisible = !this.isVolumeSliderVisible;
    this.isNoSoundTextVisible = !this.isNoSoundTextVisible;
  }

  /**
   * Sets the volume of the video player based on the value from the volume slider.
   * @param {Event} event - The change event from the input slider.
   */
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

  /**
   * Toggles fullscreen mode for the video container.
   */
  toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container') as HTMLElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainer
        .requestFullscreen()
        .then(() => {
          this.updateControlsVisibility();
        })
        .catch((err) => {
          console.error('Failed to enter fullscreen mode:', err);
        });
    }
  }

  /**
   * Updates the visibility of video controls.
   */
  updateControlsVisibility() {
    const controls = document.querySelector('.controls') as HTMLElement;
    if (controls) {
      controls.style.display = 'flex';
    }
  }

  /**
   * Handles the event when the video has ended, updating the playing state.
   */
  onVideoEnded() {
    this.isVideoEnded = true;
    this.isPlaying = false;
  }

  /**
   * Toggles the visibility of the resolution menu.
   */
  toggleResolutionMenu() {
    this.isResolutionMenuVisible = !this.isResolutionMenuVisible;
  }

  /**
   * Sets the resolution for the video, updating the start time and state.
   * @param {number} resolution - The resolution to set (e.g., 480, 720).
   */
  setResolution(resolution: number) {
    const videoPlayer = this.videoPlayer.nativeElement;
    this.videoStartTime = videoPlayer.currentTime;
    this.isPlaying = !videoPlayer.paused;

    this.selectedResolution = resolution;
    this.videoResolution = `_${resolution}p`;
  }
}
