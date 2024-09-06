import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();

  private dataStore: {
    [key: string]: any[];
  } = {
    categoryData: [
      {
        title: 'New on Videoflix',
        videos: [
          { name: 'rhythms_of_friendship' },
          { name: 'majestic_whales' },
          { name: 'whispering_shadows' },
          { name: 'babys_secret_language' },
          { name: 'world_of_wonders' },
          { name: '48_hours_to_survice' },
          { name: 'breakout' },
          { name: 'hate_you' },
        ],
      },
      {
        title: 'Documentary',
        videos: [
          { name: 'majestic_whales' },
          { name: 'babys_secret_language' },
          { name: 'world_of_wonders' },
        ],
      },
      {
        title: 'Drama',
        videos: [
          { name: 'rhythms_of_friendship' },
          { name: 'whispering_shadows' },
          { name: '48_hours_to_survice' },
          { name: 'breakout' },
          { name: 'chronicle_of_a_crime' },
        ],
      },
      {
        title: 'Romance',
        videos: [{ name: 'hate_you' }, { name: 'when_i_met_you' }],
      },
    ],
  };

  videoData = [
    {
      name: 'breakout',
      title: 'Breakout', // Funktion hierfür erstellen
      description:
        'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
      source: './assets/video/escape.mp4', // basePath + Variable
    },
    {
      name: 'baby-language',
      title: 'Baby Language', // Funktion hierfür erstellen
      description: 'The secret language of babys',
      source: './assets/video/babys_secret_language.mp4', // basePath + Variable
    },
  ];

  constructor() {}

  changeEmail(email: string) {
    this.emailSource.next(email);
  }

  // Methode zum Setzen von Daten
  setData(dataArray: any[], data: any[]): void {
    dataArray = data;
  }

  // Methode zum Abfragen von Daten

  getData(key: string): any[] {
    return this.dataStore[key] || [];
  }

  // Methode zum Hinzufügen von Daten
  addData(dataArray: any[], item: any): void {
    dataArray.push(item);
  }

  getVideoByName(name: string) {
    return this.videoData.find((video) => video.name === name);
  }
}
