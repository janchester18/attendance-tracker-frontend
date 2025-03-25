import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectOvertimeComponent } from './reject-overtime.component';

describe('RejectOvertimeComponent', () => {
  let component: RejectOvertimeComponent;
  let fixture: ComponentFixture<RejectOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectOvertimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
