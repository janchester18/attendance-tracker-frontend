import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEmpSummaryComponent } from './print-emp-summary.component';

describe('PrintEmpSummaryComponent', () => {
  let component: PrintEmpSummaryComponent;
  let fixture: ComponentFixture<PrintEmpSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintEmpSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintEmpSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
