import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  selectedVideo: string | null = null;
  previewVideo: any;
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

  thumbBasePath = 'http://localhost:8000/media/thumbnails/';
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

  triggerClosePopup(): void {
    this.addVideoPopupComponent.closeAddVideoPopup(); // Ruft die Methode der Kindkomponente auf
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
      } else {
        this.videoData.categories.splice(favoriteIndex, 1);
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
