import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent implements OnInit {
  @ViewChild('videoPlayer')
  videoPlayer!: ElementRef<HTMLVideoElement>;
  selectedVideo: string | null = null;
  videoTitle: string = '';
  videoName: string = '';
  videoDescription: string = '';
  previewVideo: any;
  hasSound: boolean = false;
  isPlaying: boolean = false;
  isVideoEnded: boolean = false;
  isMuted: boolean = true;
  isLoggedIn: boolean = false;
  isAddVideoPopupVisible: boolean = false;
  videoData: {
    name: string;
    title: string;
    description: string;
    categories: any[];
    id: number;
  } | null = null;

  selectedFile: File | null = null;
  fileSizeError: boolean = false;

  thumbBasePath = 'http://localhost:8000/media/thumbnails/';
  videoBasePath = 'http://localhost:8000/media/videos/';
  iconBasePath = '../../assets/img/icons/';

  constructor(
    private videoPopupService: VideoPopupService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
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
    console.log('headers:', headers);
    await this.dataService.loadVideoData(headers);

    this.dataService.videoData$.subscribe((data) => {
      if (data.length > 0) {
        this.previewVideo = this.dataService.getVideoByName('breakout');
      }
    });

    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideo = videoName;

      if (this.selectedVideo) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    });

    this.videoPopupService.addVideoPopupStatus$.subscribe((status) => {
      this.isAddVideoPopupVisible = status;
    });

    this.previewVideo = this.dataService.getVideoByName('breakout');

    this.closePopup();
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

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  uploadVideo() {
    if (this.selectedFile) {
      if (this.selectedFile.size <= 26214400) {
        this.videoName = this.selectedFile.name.replace('.mp4', '');

        const uploadVideoData = new FormData();
        uploadVideoData.append('name', this.videoName);
        uploadVideoData.append('title', this.videoTitle);
        uploadVideoData.append('description', this.videoDescription);
        uploadVideoData.append('categories', 'My Videos');
        uploadVideoData.append(
          'video_file',
          this.selectedFile,
          this.selectedFile.name
        );
        console.log('uploadVideoData:', uploadVideoData);

        // console.log('headers:', headers);

        if (typeof window !== 'undefined' && window.localStorage) {
          const token = localStorage.getItem('token');
          if (token) {
            const headers = new HttpHeaders().set(
              'Authorization',
              `Token ${token}`
            );
            console.log('headers:', headers);
            this.http
              .post('http://localhost:8000/api/videos/', uploadVideoData, {
                headers,
              })
              .subscribe({
                next: (response) => {
                  console.log('Server Response:', response);
                  console.log('Video erfolgreich hochgeladen.');
                  this.dataService.loadVideoData(headers);
                },
                error: (error) =>
                  console.error('Fehler beim hochladen des Videos:', error),
              });
          } else {
            console.error('Kein Token im localStorage gefunden');
          }
        } else {
          console.error(
            'localStorage ist im aktuellen Kontext nicht verfügbar uploadVideo'
          );
        }

        this.fileSizeError = false;
      } else {
        console.warn('File is bigger than 25 Megabyte! ');
        this.fileSizeError = true;
      }
    } else {
      console.log('No file selected.');
    }
  }

  closeAddVideoPopup() {
    this.videoPopupService.closeAddVideoPopup();
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
        this.videoData.id,
        this.videoData.categories
      );

      this.dataService
        .patchBackendVideo(this.videoData.id, this.videoData.categories)
        .subscribe({
          next: () =>
            console.log('Kategorien erfolgreich im Backend aktualisiert.'),
          error: (error) =>
            console.error('Fehler beim Aktualisieren der Kategorien:', error),
        });
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
