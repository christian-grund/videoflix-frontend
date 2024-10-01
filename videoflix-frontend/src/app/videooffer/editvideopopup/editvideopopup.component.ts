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

  constructor(private videoPopupService: VideoPopupService, private dataService: DataService) {}

  ngOnInit() {
    console.log('editvideopopup');
    // const token = 'aa6299bd5a2fc15db72404ffd0247ce5ef5e39b5';
    // const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    // await this.dataService.loadVideoData(headers);

    this.videoPopupService.editVideoName$.subscribe((videoName) => {
      this.editVideoName = videoName;
      console.log('editVideoName:', this.editVideoName);
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
}
