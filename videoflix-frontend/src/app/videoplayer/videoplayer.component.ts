import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  videos = [
    {
      name: 'breakout',
      title: 'Breakout', // Funktion hierfür erstellen
      source: './assets/video/escape.mp4', // basePath + Variable
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.videoname = params.get('videoname')!;
      console.log('videoname:', this.videoname);

      // Suche nach dem Video in der Liste
      this.videoData = this.videos.find(
        (video) => video.name === this.videoname
      );

      // Optional: Fehlerbehandlung, falls das Video nicht gefunden wird
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
