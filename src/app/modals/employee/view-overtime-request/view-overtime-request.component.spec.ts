import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOvertimeRequestComponent } from './view-overtime-request.component';

describe('ViewOvertimeRequestComponent', () => {
  let component: ViewOvertimeRequestComponent;
  let fixture: ComponentFixture<ViewOvertimeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOvertimeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
