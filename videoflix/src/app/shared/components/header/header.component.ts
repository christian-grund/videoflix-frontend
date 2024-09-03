import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.url.subscribe((segments) => {
      this.currentUrl = '/' + segments.map((segment) => segment.path).join('/');
      this.changeDetectorRef.detectChanges(); // Hier wird die Change Detection ausgelöst
      console.log('currentUrl:', this.currentUrl);
    });
  }
}
