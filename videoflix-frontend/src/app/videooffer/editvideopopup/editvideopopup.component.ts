import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { DataService } from '../../shared/services/data.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-editvideopopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editvideopopup.component.html',
  styleUrl: './editvideopopup.component.scss',
})
export class EditvideopopupComponent implements OnInit {
  videoTitleOrigin: string = '';
  videoTitle: string = '';
  videoName: string = '';
  videoDescription: string = '';
  hasSound: boolean = false;
  isLoading: boolean = false;
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

  constructor(private videoPopupService: VideoPopupService, private dataService: DataService) {}

  ngOnInit() {
    this.videoPopupService.editVideoName$.subscribe((videoName) => {
      this.editVideoName = videoName;
      if (this.editVideoName) {
        this.videoData = this.dataService.getVideoByName(this.editVideoName) || null;
        if (this.videoData) {
          this.videoTitle = this.videoData.title;
          this.videoTitleOrigin = this.videoData.title;
          this.videoDescription = this.videoData.description;
          this.hasSound = this.videoData.has_sound;
          this.selectedFile = this.videoData.video_file;
        }
      }
    });
  }

  async saveEditedVideo() {
    if (this.videoData) {
      this.isLoading = true;
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
        this.checkUpdatedThumbnailStatus();
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kategorien:', error);
      }
    }
    // this.closeEditVideoPopup();
    this.dataService.loadVideoData(this.dataService.getAuthHeaders());
  }

  checkUpdatedThumbnailStatus() {
    const interval = setInterval(() => {
      this.dataService.loadThumbnailStatus(this.editVideoName as string).subscribe({
        next: (response) => {
          if (response.status === 'completed') {
            console.log('Thumbnail wurde erfolgreich erstellt');
            clearInterval(interval);
            setTimeout(() => {
              this.dataService.loadVideoData(this.dataService.getAuthHeaders());
            }, 1000);

            this.dataService.triggerConvertionCheck(this.videoName);
            this.isLoading = false;
            this.closeEditVideoPopup();
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
}
