import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-videooffer',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CategoryComponent],
  templateUrl: './videooffer.component.html',
  styleUrl: './videooffer.component.scss',
})
export class VideoofferComponent {}
