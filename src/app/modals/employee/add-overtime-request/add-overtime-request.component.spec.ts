import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOvertimeRequestComponent } from './add-overtime-request.component';

describe('AddOvertimeRequestComponent', () => {
  let component: AddOvertimeRequestComponent;
  let fixture: ComponentFixture<AddOvertimeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOvertimeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
