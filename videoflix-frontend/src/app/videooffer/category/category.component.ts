import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { VideoPopupService } from '../../shared/services/videopopup.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  public basePath = './../../../assets/img/thumbnails/';
  public categories: any[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private videoPopupService: VideoPopupService
  ) {}

  ngOnInit(): void {
    this.categories = this.dataService.getData('categoryData');
    console.log('categoryData:', this.categories);
  }

  openVideoInfo(videoName: string) {
    this.videoPopupService.openVideoPopup(videoName);
  }

  openVideo(videoName: string) {
    this.router.navigate([`/videos/watch/${videoName}`]);
  }
}
