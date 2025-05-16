import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertMplComponent } from './convert-mpl.component';

describe('ConvertMplComponent', () => {
  let component: ConvertMplComponent;
  let fixture: ComponentFixture<ConvertMplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertMplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertMplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
