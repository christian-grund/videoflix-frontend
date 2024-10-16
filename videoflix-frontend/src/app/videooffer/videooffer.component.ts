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

  checkAuthStatus() {
    this.authService.checkAuthStatus();
  }
  
  setupAuthListener(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn !== null) {
        this.isLoading = false;
      }
    });
  }
  
  async loadVideoData(): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Token ${localStorage.getItem('token')}`);
    await this.dataService.loadVideoData(headers);
  }
  
  setupDataListeners(): void {
    this.dataService.videoData$.subscribe((data) => {
      if (data.length > 0) {
        this.previewVideo = this.dataService.getVideoByName('breakout');
      }
    });
  }
  
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
  
  closePopupIfOpen(): void {
    this.previewVideo = this.dataService.getVideoByName('breakout');
    if (this.openVideoPopupComponent) {
      this.openVideoPopupComponent.closePopup();
    }
  }
  

  ngAfterViewInit() {
    if (this.selectedVideoName && this.openVideoPopupComponent) {
      this.openVideoPopupComponent.openPopup();
    }
  }

  closePopup() {
    this.selectedVideoName = null;
  }

  triggerCloseAddVideoPopup(): void {
    this.addVideoPopupComponent.closeAddVideoPopup();
  }

  triggerCloseEditVideoPopup(): void {
    this.editVideoPopupComponent.closeEditVideoPopup();
  }

  triggerCloseOpenVideoPopup(): void {
    this.openVideoPopupComponent.closePopup();
  }

  openVideo(videoName: string) {
    if (videoName) {
      this.router.navigate([`/videos/watch/${videoName}`]);
    }
  }

  enableVideoPlay() {
    this.canPlayVideo = true;
  }

  playVideo() {
    if (this.canPlayVideo) {
      const videoPlayer = this.videoPlayer.nativeElement;
      videoPlayer.play();
    }
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
