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

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    OpenvideopopupComponent,
    AddvideopopupComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent implements OnInit {
  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(AddvideopopupComponent)
  addVideoPopupComponent!: AddvideopopupComponent;
  @ViewChild(OpenvideopopupComponent)
  openVideoPopupComponent!: OpenvideopopupComponent;
  selectedVideoName: string | null = null;

  previewVideo: any;
  isPlaying: boolean = false;
  isVideoEnded: boolean = false;
  isMuted: boolean = true;
  isLoggedIn: boolean = false;
  isAddVideoPopupVisible: boolean = false;
  isEditVideoPopupVisible: boolean = false;

  videoTitle: string = '';
  videoName: string = '';
  videoDescription: string = '';
  hasSound: boolean = false;
  selectedFile: File | null = null;
  fileSizeError: boolean = false;
  editVideoName: string | null = null;

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
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    ///////////// nur das, ohne authguard testen!!!!

    // this.route.data.subscribe((data) => {
    //   this.isLoggedIn = data['isLoggedIn']; // Daten vom Resolver
    //   if (!this.isLoggedIn) {
    //     this.router.navigate(['/login']); // Weiterleitung zur Login-Seite, falls nicht eingeloggt
    //   }
    // });

    // const token = localStorage.getItem('token');
    const token = '907395f03c73038f77baf0dab199fbb2bc35459a';
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    await this.dataService.loadVideoData(headers);

    this.dataService.videoData$.subscribe((data) => {
      if (data.length > 0) {
        this.previewVideo = this.dataService.getVideoByName('breakout');
      }
    });

    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideoName = videoName;
    });

    this.videoPopupService.editVideoName$.subscribe((videoName) => {
      this.editVideoName = videoName;
      console.log('videooffer oninit editVideoName:', this.editVideoName);
      if (this.editVideoName) {
        this.videoData = this.dataService.getVideoByName(this.editVideoName) || null;
        console.log('videooffer oninit videoData:', this.videoData);

        if (this.videoData) {
          this.videoTitle = this.videoData.title;
          this.videoDescription = this.videoData.description;
          this.hasSound = this.videoData.has_sound;
          this.selectedFile = this.videoData.video_file;
        }
      }
    });

    this.videoPopupService.addVideoPopupStatus$.subscribe((status) => {
      this.isAddVideoPopupVisible = status;
    });

    // this.videoPopupService.openEditVideoPopup.subscribe((status) => {
    //   // this.isEditVideoPopupVisible = status;
    // });

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

  async saveEditedVideo() {
    if (this.videoData) {
      const formData = new FormData();

      formData.append('title', this.videoTitle);
      formData.append('description', this.videoDescription);
      formData.append('has_sound', this.hasSound.toString());
      if (this.selectedFile instanceof File) {
        formData.append('video_file', this.selectedFile);
        formData.append('name', this.selectedFile!.name.replace('.mp4', ''));
      }
      try {
        const response = await this.dataService.patchBackendVideo(this.videoData.id, formData);
        console.log('Video erfolgreich im Backend aktualisiert:', response);
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kategorien:', error);
      }
    }
    this.closeEditVideoPopup();
    this.dataService.loadVideoData(this.dataService.getAuthHeaders());
  }

  async deleteVideo() {
    if (this.videoData) {
      try {
        const response = await this.dataService.deleteBackendVideo(this.videoData.id);
        console.log('Video wurde erfolgreich gelöscht:', response);
      } catch (error) {
        console.log('Fehler beim löschen des Videos:', error);
      }
    }
    this.closeEditVideoPopup();
    this.dataService.loadVideoData(this.dataService.getAuthHeaders());
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  closeEditVideoPopup() {
    this.videoPopupService.closeEditVideoPopup();
  }

  // async getHeaders(): Promise<HttpHeaders> {
  //   const token = localStorage.getItem('token');

  //   // Überprüfen, ob ein Token vorhanden ist
  //   if (token) {
  //     return new HttpHeaders({
  //       Authorization: `Token ${token}`,
  //     });
  //   } else {
  //     console.error('Kein Token im localStorage gefunden');
  //     return new HttpHeaders(); // Leere Header zurückgeben
  //   }
  // }

  closePopup() {
    this.selectedVideoName = null;
  }

  triggerCloseAddVideoPopup(): void {
    this.addVideoPopupComponent.closeAddVideoPopup();
  }

  triggerCloseOpenVideoPopup(): void {
    this.openVideoPopupComponent.closePopup();
  }

  openVideo(videoName: string) {
    if (videoName) {
      this.router.navigate([`/videos/watch/${videoName}`]);
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

  // getHttpHeaders() {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     `Token ${localStorage.getItem('token')}`
  //   );

  //   return headers;
  // }
}
