import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-addvideopopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addvideopopup.component.html',
  styleUrl: './addvideopopup.component.scss',
  encapsulation: ViewEncapsulation.None, //
})
export class AddvideopopupComponent implements OnInit, OnDestroy {
  // subscriptions auch im constructor???
  private subscriptions: Subscription = new Subscription();

  videoTitle: string = '';
  videoName: string = '';
  videoDescription: string = '';
  userVideoCounter: number = 0;
  hasSound: boolean = false;
  fileInserted: boolean = false;
  fileSizeError: boolean = false;
  selectedFile: File | null = null;

  isLoading: boolean = false;

  constructor(
    private dataService: DataService,
    private videoPopupService: VideoPopupService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.videoPopupService.triggerCountVideos$.subscribe(() => {
        this.countUserUploadedVideos();
      })
    );
  }

  ngOnDestroy(): void {
    // Aufräumen der Subscriptions
    if (this.subscriptions) {
      this.subscriptions.unsubscribe(); // unsubscribe aufrufen, um alle Subscriptions zu beenden
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.fileInserted = true;
      if (this.selectedFile.size <= 26214400) {
        this.fileSizeError = false;
      } else {
        this.fileSizeError = true;
      }
    } else {
      this.fileInserted = false;
    }
  }

  async uploadVideo() {
    if (this.selectedFile && this.selectedFile.size <= 26214400 && this.userVideoCounter <= 3) {
      this.isLoading = true;
      this.videoName = this.selectedFile.name.replace('.mp4', '');

      const uploadVideoData = new FormData();
      uploadVideoData.append('name', this.videoName);
      uploadVideoData.append('title', this.videoTitle);
      uploadVideoData.append('description', this.videoDescription);
      uploadVideoData.append('categories', 'My Videos');
      uploadVideoData.append('video_file', this.selectedFile, this.selectedFile.name);

      try {
        // Warte auf das Hochladen des Videos
        await firstValueFrom(this.dataService.setVideosInBackend(uploadVideoData));

        // Führe die Überprüfung des Thumbnail-Status aus
        this.checkThumbnailStatus();

        // Nachdem der Status überprüft wurde, lade die Video-Daten neu
      } catch (error) {
        console.error('Fehler beim Hochladen des Videos oder der Statusüberprüfung:', error);
      } finally {
        this.isLoading = false; // Setze den Ladezustand zurück
      }

      this.fileSizeError = false;
    } else {
      this.fileSizeError = true;
    }
  }

  checkThumbnailStatus() {
    const interval = setInterval(() => {
      this.dataService.loadThumbnailStatus(this.videoName).subscribe({
        next: (response) => {
          console.log('Response:', response);
          if (response.status === 'completed') {
            console.log('Thumbnail wurde erfolgreich erstellt');
            clearInterval(interval);
            setTimeout(() => {
              this.dataService.loadVideoData(this.dataService.getAuthHeaders());
            }, 1000);
            this.isLoading = false;
            this.closeAddVideoPopup();
            // this.dataService.loadConvertionStatus(this.videoName);
            this.dataService.triggerConvertionCheck(this.videoName);
          } else {
            console.log('Thumbnail in Bearbeitung...');
          }
        },
        error: (error) => {
          console.error('Fehler beim Überprüfen des Thumbnail-Status:', error);
          clearInterval(interval);
        },
      });
    }, 500);
  }

  countUserUploadedVideos() {
    const data = this.dataService.getData();
    this.userVideoCounter = 0;
    data.forEach((item) => {
      if (item.user !== null) {
        this.userVideoCounter++;
      }
    });
    console.log('userVideoCounter:', this.userVideoCounter);
  }

  closeAddVideoPopup() {
    this.videoPopupService.closeAddVideoPopup();
    this.userVideoCounter = 0;
  }
}
