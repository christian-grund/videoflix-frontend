import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataprivacyComponent } from './dataprivacy.component';

describe('DataprivacyComponent', () => {
  let component: DataprivacyComponent;
  let fixture: ComponentFixture<DataprivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataprivacyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataprivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
