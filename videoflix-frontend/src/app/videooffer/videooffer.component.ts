import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CategoryComponent } from './category/category.component';
import { VideoPopupService } from '../shared/services/videopopup.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OpenvideopopupComponent } from './openvideopopup/openvideopopup.component';
import { AddvideopopupComponent } from './addvideopopup/addvideopopup.component';
import { EditvideopopupComponent } from './editvideopopup/editvideopopup.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    OpenvideopopupComponent,
    AddvideopopupComponent,
    EditvideopopupComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(AddvideopopupComponent) addVideoPopupComponent!: AddvideopopupComponent;
  @ViewChild(OpenvideopopupComponent) openVideoPopupComponent!: OpenvideopopupComponent;
  @ViewChild(EditvideopopupComponent) editVideoPopupComponent!: EditvideopopupComponent;
  selectedVideoName: string | null = null;
  editVideoName: string | null = null;
  previewVideo: any;
  canPlayVideo = false;
  isPlaying: boolean = false;
  isVideoEnded: boolean = false;
  isMuted: boolean = true;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  isAddVideoPopupVisible: boolean = false;
  isEditVideoPopupVisible: boolean = false;

  videoData: {
    name: string;
    title: string;
    description: string;
    categories: any[];
    id: number;
    has_sound: boolean;
    video_file: File;
  } | null = null;

  videoBasePath = 'http://localhost:8000/media/videos/';
  iconBasePath = '../../assets/img/icons/';

  constructor(
    private videoPopupService: VideoPopupService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.checkAuthStatus();
    this.setupAuthListener();

    if (isPlatformBrowser(this.platformId)) {
      await this.loadVideoData();
    }

    this.setupDataListeners();
    this.setupPopupListeners();
    this.closePopupIfOpen();
  }

  /**
   * Checks the current authentication status using the authService.
   */
  checkAuthStatus() {
    this.authService.checkAuthStatus();
  }

  /**
   * Sets up a listener to monitor the authentication status and updates the loading state accordingly.
   */
  setupAuthListener(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn !== null) {
        this.isLoading = false;
      }
    });
  }

  /**
   * Loads video data from the data service with an authorization token from local storage.
   * @returns {Promise<void>} A promise that resolves when the video data has been loaded.
   */
  async loadVideoData(): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
    await this.dataService.loadVideoData(headers);
  }

  /**
   * Sets up listeners for video data changes, updating the preview video
   * when new data is available.
   */
  setupDataListeners(): void {
    this.dataService.videoData$.subscribe((data) => {
      if (data.length > 0) {
        this.previewVideo = this.dataService.getVideoByName('breakout');
      }
    });
  }

  /**
   * Sets up listeners for popup events, including the video name, edit video name,
   * and add video popup visibility status.
   */
  setupPopupListeners(): void {
    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideoName = videoName;
    });

    this.videoPopupService.editVideoName$.subscribe((videoName) => {
      this.editVideoName = videoName;
    });

    this.videoPopupService.addVideoPopupStatus$.subscribe((status) => {
      this.isAddVideoPopupVisible = status;
    });
  }

  /**
   * Closes the video popup if it is open and resets the preview video to the
   * 'breakout' video.
   */
  closePopupIfOpen(): void {
    this.previewVideo = this.dataService.getVideoByName('breakout');
    if (this.openVideoPopupComponent) {
      this.openVideoPopupComponent.closePopup();
    }
  }

  /**
   * Opens the video popup if a video name is selected and the popup component is available.
   */
  ngAfterViewInit() {
    if (this.selectedVideoName && this.openVideoPopupComponent) {
      this.openVideoPopupComponent.openPopup();
    }
  }

  /**
   * Resets the selected video name to null, effectively closing the popup.
   */
  closePopup() {
    this.selectedVideoName = null;
  }

  /**
   * Triggers the closing of the add video popup component.
   */
  triggerCloseAddVideoPopup(): void {
    this.addVideoPopupComponent.closeAddVideoPopup();
  }

  /**
   * Triggers the closing of the edit video popup component.
   */
  triggerCloseEditVideoPopup(): void {
    this.editVideoPopupComponent.closeEditVideoPopup();
  }

  /**
   * Triggers the closing of the open video popup component.
   */
  triggerCloseOpenVideoPopup(): void {
    this.openVideoPopupComponent.closePopup();
  }

  /**
   * Navigates to the video watch page for the specified video name.
   * @param {string} videoName - The name of the video to watch.
   */
  openVideo(videoName: string) {
    if (videoName) {
      this.router.navigate([`/videos/watch/${videoName}`]);
    }
  }

  /**
   * Enables the ability to play video by setting the corresponding flag.
   */
  enableVideoPlay() {
    this.canPlayVideo = true;
  }

  /**
   * Plays the video if the canPlayVideo flag is true.
   */
  playVideo() {
    if (this.canPlayVideo) {
      const videoPlayer = this.videoPlayer.nativeElement;
      videoPlayer.play();
    }
  }

  /**
   * Pauses the currently playing video.
   */
  pauseVideo() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.pause();
  }

  /**
   * Replays the video from the beginning and starts playback.
   */
  replayVideo() {
    const videoPlayer = this.videoPlayer.nativeElement;
    videoPlayer.currentTime = 0;
    videoPlayer.play();
  }
}
