import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { VideoPopupService } from '../../shared/services/videopopup.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-openvideopopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './openvideopopup.component.html',
  styleUrl: './openvideopopup.component.scss',
})
export class OpenvideopopupComponent implements OnInit {
  @Input() selectedVideoName: string | null = null;
  @Output() closePopupEvent = new EventEmitter<void>();
  videoData: {
    name: string;
    title: string;
    description: string;
    categories: any[];
    id: number;
  } | null = null;

  // thumbBasePath = 'http://localhost:8000/media/thumbnails/';
  thumbBasePath = environment.apiUrl + 'media/thumbnails/';

  constructor(private dataService: DataService, private router: Router, private videoPopupService: VideoPopupService) {}

  ngOnInit(): void {
    this.subscribeVideoName();
  }

  /**
   * Subscribes to the video name from the videoPopupService and opens or closes the popup
   * based on whether a video name is selected.
   */
  subscribeVideoName() {
    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideoName = videoName;

      if (this.selectedVideoName) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    });
  }

  /**
   * Opens the edit video popup for the specified video name after closing any existing popup.
   * @param {string} videoName - The name of the video to edit.
   */
  openEditVideoPopup(videoName: string) {
    this.closePopup();
    this.videoPopupService.openEditVideoPopup(videoName);
  }

  /**
   * Opens the popup and retrieves the video data based on the selected video name.
   */
  openPopup() {
    if (this.selectedVideoName) {
      this.videoData = this.dataService.getVideoByName(this.selectedVideoName) || null;
    }
  }

  /**
   * Closes the popup, resets the selected video name and video data,
   * and emits a close event.
   */
  closePopup() {
    this.selectedVideoName = null;
    this.videoData = null;
    this.closePopupEvent.emit();
  }

  /**
   * Navigates to the video watch page for the specified video name after closing the popup.
   * @param {string} videoName - The name of the video to watch.
   */
  openVideo(videoName: string) {
    if (videoName) {
      this.closePopup();
      this.router.navigate([`/videos/watch/${videoName}`]);
    }
  }

  /**
   * Checks if the current video is marked as a favorite.
   * @returns {boolean} True if the video is in the 'Favorites' category, otherwise false.
   */
  isFavorite(): boolean {
    return this.videoData?.categories.includes('Favorites') ?? false;
  }

  /**
   * Adds the current video to or removes it from the 'Favorites' category
   * and updates the backend accordingly.
   */
  addToOrRemoveFromFavorites() {
    if (this.videoData) {
      const favoriteIndex = this.videoData.categories.indexOf('Favorites');

      if (favoriteIndex === -1) {
        this.videoData.categories.push('Favorites');
      } else {
        this.videoData.categories.splice(favoriteIndex, 1);
      }
      this.updateVideoCategories();
      this.patchBackendVideoCategories();
    }
  }

  /**
   * Updates the video categories in the data service for the current video.
   */
  updateVideoCategories() {
    if (this.videoData) {
      this.dataService.updateVideoCategories(this.videoData.id, this.videoData.categories);
    }
  }

  /**
   * Patches the backend with the updated categories for the current video
   * and logs the result or error.
   */
  patchBackendVideoCategories() {
    if (this.videoData) {
      this.dataService.patchBackendVideoCategories(this.videoData.id, this.videoData.categories).subscribe({
        next: () => console.log('Kategorien erfolgreich im Backend aktualisiert.'),
        error: (error) => console.error('Fehler beim Aktualisieren der Kategorien:', error),
      });
    }
  }
}
