import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditvideopopupComponent } from './editvideopopup.component';

describe('EditvideopopupComponent', () => {
  let component: EditvideopopupComponent;
  let fixture: ComponentFixture<EditvideopopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditvideopopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditvideopopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
