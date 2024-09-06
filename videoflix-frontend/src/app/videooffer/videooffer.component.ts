import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CategoryComponent } from './category/category.component';
import { VideoPopupService } from '../shared/services/videopopup.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CategoryComponent, CommonModule],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent implements OnInit {
  selectedVideo: string | null = null;

  constructor(private videoPopupService: VideoPopupService) {}

  ngOnInit(): void {
    this.videoPopupService.videoName$.subscribe((videoName) => {
      this.selectedVideo = videoName;

      if (this.selectedVideo) {
        this.openPopup();
      } else {
        this.closePopup();
      }
    });
  }

  openPopup() {
    console.log('Popup opened for video:', this.selectedVideo);
  }

  closePopup() {
    this.selectedVideo = null; // Set to null to close the popup
    // this.videoPopupService.closeVideoPopup(); // Notify the service that the popup is closed
    console.log('Popup closed');
  }
}
