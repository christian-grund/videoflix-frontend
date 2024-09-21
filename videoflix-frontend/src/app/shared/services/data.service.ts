import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // videoData = [
  //   {
  //     name: 'rhythms_of_friendship',
  //     title: 'Rhythms of Friendship',
  //     description: 'A heartwarming story about the bond between two friends...',
  //     categories: ['New on Videoflix', 'Drama'],
  //   },
  //   {
  //     name: 'majestic_whales',
  //     title: 'Majestic Whales',
  //     description:
  //       'A documentary exploring the beauty and mystery of whales...',
  //     categories: ['New on Videoflix', 'Documentary'],
  //   },
  //   {
  //     name: 'whispering_shadows',
  //     title: 'Whispering Shadows',
  //     description:
  //       'A suspenseful thriller where secrets lurk in the shadows...',
  //     categories: ['New on Videoflix', 'Drama'],
  //   },
  //   {
  //     name: 'babys_secret_language',
  //     title: "Baby's Secret Language",
  //     description:
  //       'A fascinating look into the unique ways babies communicate...',
  //     categories: ['New on Videoflix', 'Documentary'],
  //   },
  //   {
  //     name: 'world_of_wonders',
  //     title: 'World of Wonders',
  //     description:
  //       'Travel the globe to witness some of the most breathtaking natural wonders...',
  //     categories: ['New on Videoflix', 'Documentary'],
  //   },
  //   {
  //     name: '48_hours_to_survive',
  //     title: '48 Hours to Survive',
  //     description:
  //       'A gripping action film about a man who has only 48 hours...',
  //     categories: ['New on Videoflix', 'Drama'],
  //   },
  //   {
  //     name: 'breakout',
  //     title: 'Breakout',
  //     description:
  //       'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
  //     categories: ['New on Videoflix', 'Drama'],
  //   },
  //   {
  //     name: 'hate_you',
  //     title: 'Hate You',
  //     description: 'A dramatic tale of love and betrayal...',
  //     categories: ['New on Videoflix', 'Romance'],
  //   },
  //   {
  //     name: 'chronicle_of_a_crime',
  //     title: 'Chronicle of a Crime',
  //     description:
  //       'An intense crime drama that follows the unraveling of a perfect crime...',
  //     categories: ['Drama'],
  //   },
  //   {
  //     name: 'when_i_met_you',
  //     title: 'When I Met You',
  //     description: 'A romantic film about two strangers who meet by chance...',
  //     categories: ['Romance'],
  //   },
  // ];

  videoData: any[] = [];

  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();
  private videoDataSubject = new BehaviorSubject<any[]>(this.videoData);
  videoData$ = this.videoDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  getVideosFromBackend() {
    return this.http.get<any[]>('http://localhost:8000/api/videos/');
  }

  async loadVideoData() {
    this.getVideosFromBackend().subscribe({
      next: (data) => {
        this.videoData = data;
        this.videoDataSubject.next(this.videoData);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Videodaten', error);
      },
    });
  }

  changeEmail(email: string) {
    this.emailSource.next(email);
  }

  // Methode zum Setzen von Daten
  setData(dataArray: any[], data: any[]): void {
    dataArray = data;
  }

  // Methode zum Abfragen von Daten
  getData(key: string): any[] {
    return this.videoData;
  }

  // Methode zum Hinzufügen von Daten
  addData(dataArray: any[], item: any): void {
    dataArray.push(item);
  }

  getVideoByName(name: string) {
    return this.videoData.find((video) => video.name === name);
  }

  updateVideoCategories(videoName: string, categories: string[]) {
    const videoIndex = this.videoData.findIndex(
      (video) => video.name === videoName
    );

    if (videoIndex !== -1) {
      this.videoData[videoIndex].categories = categories;
      this.videoDataSubject.next(this.videoData); // Trigger ein Update
      console.log(
        `Kategorien von ${videoName} wurden aktualisiert:`,
        categories
      );
    } else {
      console.error(`Video mit dem Namen ${videoName} wurde nicht gefunden.`);
    }
  }
}
