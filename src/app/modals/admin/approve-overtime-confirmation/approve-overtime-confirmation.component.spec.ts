import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveOvertimeConfirmationComponent } from './approve-overtime-confirmation.component';

describe('ApproveOvertimeConfirmationComponent', () => {
  let component: ApproveOvertimeConfirmationComponent;
  let fixture: ComponentFixture<ApproveOvertimeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveOvertimeConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveOvertimeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
