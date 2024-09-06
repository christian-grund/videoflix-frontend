import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent implements OnInit {
  videoname!: string;
  videoData: any;
  isPlaying = false;
  isMuted = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.videoname = params.get('videoname')!;
      this.videoData = this.dataService.getVideoByName(this.videoname);

      if (!this.videoData) {
        console.error('Video not found!');
      } else {
        console.log('Video data:', this.videoData);
      }
    });
  }

  playPause(videoPlayer: HTMLVideoElement) {
    if (videoPlayer.paused) {
      videoPlayer.play();
      this.isPlaying = true;
    } else {
      videoPlayer.pause();
      this.isPlaying = false;
    }
  }

  seek(videoPlayer: HTMLVideoElement, event: any) {
    videoPlayer.currentTime = event.target.value;
  }

  toggleMute(videoPlayer: HTMLVideoElement) {
    videoPlayer.muted = !videoPlayer.muted;
    this.isMuted = videoPlayer.muted;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
