import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenvideopopupComponent } from './openvideopopup.component';

describe('OpenvideopopupComponent', () => {
  let component: OpenvideopopupComponent;
  let fixture: ComponentFixture<OpenvideopopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenvideopopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenvideopopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
