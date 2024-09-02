import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  public basePath = './../../../assets/img/thumbnails/';

  categories = [
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
  ];
}
