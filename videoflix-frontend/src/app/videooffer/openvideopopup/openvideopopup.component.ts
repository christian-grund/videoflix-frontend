import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { VideoPopupService } from '../../shared/services/videopopup.service';

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

  thumbBasePath = 'http://localhost:8000/media/thumbnails/';

  constructor(private dataService: DataService, private router: Router, private videoPopupService: VideoPopupService) {}

  ngOnInit(): void {
    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideoName = videoName;

      if (this.selectedVideoName) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    });
  }

  openEditVideoPopup(videoName: string) {
    this.closePopup();
    this.videoPopupService.openEditVideoPopup(videoName);
  }

  openPopup() {
    if (this.selectedVideoName) {
      this.videoData = this.dataService.getVideoByName(this.selectedVideoName) || null;
    }
  }

  closePopup() {
    this.selectedVideoName = null;
    this.videoData = null;
    this.closePopupEvent.emit();
  }

  openVideo(videoName: string) {
    if (videoName) {
      this.closePopup();
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
      this.dataService.updateVideoCategories(this.videoData.id, this.videoData.categories);

      this.dataService.patchBackendVideoCategories(this.videoData.id, this.videoData.categories).subscribe({
        next: () => console.log('Kategorien erfolgreich im Backend aktualisiert.'),
        error: (error) => console.error('Fehler beim Aktualisieren der Kategorien:', error),
      });
    }
  }
}
