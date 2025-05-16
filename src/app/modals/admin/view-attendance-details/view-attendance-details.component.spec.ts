import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceDetailsComponent } from './view-attendance-details.component';

describe('ViewAttendanceDetailsComponent', () => {
  let component: ViewAttendanceDetailsComponent;
  let fixture: ComponentFixture<ViewAttendanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAttendanceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAttendanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
