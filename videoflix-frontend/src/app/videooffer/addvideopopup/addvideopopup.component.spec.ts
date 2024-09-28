import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvideopopupComponent } from './addvideopopup.component';

describe('AddvideopopupComponent', () => {
  let component: AddvideopopupComponent;
  let fixture: ComponentFixture<AddvideopopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddvideopopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddvideopopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
