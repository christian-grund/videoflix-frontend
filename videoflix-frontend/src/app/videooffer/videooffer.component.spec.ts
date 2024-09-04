import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoofferComponent } from './videooffer.component';

describe('VideoofferComponent', () => {
  let component: VideoofferComponent;
  let fixture: ComponentFixture<VideoofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoofferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
