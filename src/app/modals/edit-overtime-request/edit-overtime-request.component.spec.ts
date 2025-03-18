import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOvertimeRequestComponent } from './edit-overtime-request.component';

describe('EditOvertimeRequestComponent', () => {
  let component: EditOvertimeRequestComponent;
  let fixture: ComponentFixture<EditOvertimeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOvertimeRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
