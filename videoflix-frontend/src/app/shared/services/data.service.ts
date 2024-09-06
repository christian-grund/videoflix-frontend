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
      name: 'rhythms_of_friendship',
      title: 'Rhythms of Friendship',
      description:
        'A heartwarming story about the bond between two friends, set to the backdrop of music and cultural differences.',
    },
    {
      name: 'majestic_whales',
      title: 'Majestic Whales',
      description:
        'A documentary exploring the beauty and mystery of whales in their natural habitat, capturing their grace and grandeur.',
    },
    {
      name: 'whispering_shadows',
      title: 'Whispering Shadows',
      description:
        'A suspenseful thriller where secrets lurk in the shadows, and a detective must uncover the truth before it’s too late.',
    },
    {
      name: 'babys_secret_language',
      title: "Baby's Secret Language",
      description:
        'A fascinating look into the unique ways babies communicate before they can speak, unlocking the mysteries of early language development.',
    },
    {
      name: 'world_of_wonders',
      title: 'World of Wonders',
      description:
        'Travel the globe to witness some of the most breathtaking natural wonders and explore the hidden gems of our planet.',
    },
    {
      name: '48_hours_to_survice',
      title: '48 Hours to Survive',
      description:
        'A gripping action film about a man who has only 48 hours to clear his name and escape a deadly conspiracy.',
    },
    {
      name: 'breakout',
      title: 'Breakout',
      description:
        'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence.',
    },
    {
      name: 'hate_you',
      title: 'Hate You',
      description:
        'A dramatic tale of love and betrayal, where passion turns to hatred and relationships are put to the ultimate test.',
    },
    {
      name: 'chronicle_of_a_crime',
      title: 'Chronicle of a Crime',
      description:
        'An intense crime drama that follows the unraveling of a perfect crime and the detective determined to bring justice.',
    },
    {
      name: 'when_i_met_you',
      title: 'When I Met You',
      description:
        'A romantic film about two strangers who meet by chance, and how their lives are forever changed by that encounter.',
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
    console.log('name:', name);
    return this.videoData.find((video) => video.name === name);
  }
}
