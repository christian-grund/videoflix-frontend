import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { DataService } from '../../shared/services/data.service';
import { HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { environment } from '../../../environments/environment';
import axios, { AxiosError } from 'axios';

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

  // videoBasePath = 'http://localhost:8000/media/videos/';
  videoBasePath = environment.apiUrl + 'media/videos/';
  iconBasePath = '../../assets/img/icons/';

  constructor(private videoPopupService: VideoPopupService, private dataService: DataService) {}

  ngOnInit() {
    this.getVideoData();
  }

  /**
   * Retrieves video data for editing based on the name from the videoPopupService.
   * If the video data is found, it populates the relevant fields for editing.
   */
  getVideoData() {
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

  /**
   * Saves the edited video data to the backend if valid video data is available.
   * It updates the video information and checks for the updated thumbnail status.
   */
  async saveEditedVideo() {
    if (this.videoData) {
      this.isLoading = true;
      const formData = this.updateFormData();
      try {
        const response = await this.dataService.patchBackendVideo(this.videoData.id, formData);
        this.checkUpdatedThumbnailInterval();
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Kategorien:', error);
      }
    }
    this.dataService.loadVideoData(this.dataService.getAuthHeaders());
  }

  /**
   * Updates the form data with the current video details for submission.
   * @returns {FormData} The FormData object containing updated video details.
   */
  updateFormData() {
    const formData = new FormData();
    formData.append('title', this.videoTitle);
    formData.append('description', this.videoDescription);
    formData.append('has_sound', this.hasSound.toString());
    if (this.selectedFile instanceof File) {
      formData.append('video_file', this.selectedFile);
      formData.append('name', this.selectedFile!.name.replace('.mp4', ''));
    }
    return formData;
  }

  /**
   * Initiates an interval to check the thumbnail status after updating the video.
   */
  checkUpdatedThumbnailInterval() {
    const interval: NodeJS.Timeout = setInterval(() => this.checkUpdatedThumbnailStatus(interval), 500);
  }

  /**
   * Checks the thumbnail status for the currently edited video at regular intervals.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the thumbnail status check.
   */
  checkUpdatedThumbnailStatus(interval: NodeJS.Timeout) {
    this.dataService.loadThumbnailStatus(this.editVideoName as string).subscribe({
      next: (response) => this.handleThumbnailRespone(response, interval),
      error: (error) => this.handleThumbnailError(error, interval),
    });
  }

  /**
   * Handles the response from the thumbnail status check and performs actions based on its completion.
   * @param {any} response - The response containing the thumbnail status.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the thumbnail status check.
   */
  handleThumbnailRespone(response: any, interval: NodeJS.Timeout) {
    if (response.status === 'completed') {
      clearInterval(interval);
      setTimeout(() => this.dataService.loadVideoData(this.dataService.getAuthHeaders()), 1000);
      this.dataService.triggerConvertionCheck(this.videoName);
      this.isLoading = false;
      this.closeEditVideoPopup();
    }
  }

  /**
   * Handles any errors that occur during the thumbnail status check and clears the interval.
   * @param {any} error - The error object containing error information.
   * @param {NodeJS.Timeout} interval - The interval ID for tracking the thumbnail status check.
   */
  handleThumbnailError(error: any, interval: NodeJS.Timeout) {
    console.error('Fehler beim Überprüfen des Thumbnail-Status:', error);
    clearInterval(interval);
  }

  getAuthHeaders(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Token ${localStorage.getItem('token')}`,
    });
    return headers;
  }

  /**
   * Deletes the currently selected video from the backend and closes the edit video popup.
   */
  async deleteVideo() {
    if (this.videoData) {
      try {
        const headers = {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        };
        const response = await axios.delete(`http://localhost:8000/api/videos/${this.videoData.id}/`, { headers });
      } catch (error) {
        console.error('Fehler beim Löschen des Videos:', error);
        if (error instanceof AxiosError) {
          console.error('Serverantwort:', error.response?.data);
          console.error('Status:', error.response?.status);
        } else {
          console.error('Ein unbekannter Fehler ist aufgetreten:', error);
        }
      }
    }
    this.closeEditVideoPopup();
    this.dataService.loadVideoData(this.dataService.getAuthHeaders());
  }

  /**
   * Handles the file selection event and stores the selected file for further processing.
   * @param {Event} event - The event object containing information about the file input.
   */
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  /**
   * Closes the edit video popup.
   */
  closeEditVideoPopup() {
    this.videoPopupService.closeEditVideoPopup();
  }
}
