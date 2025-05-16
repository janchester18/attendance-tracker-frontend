import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSummaryComponent } from './print-summary.component';

describe('PrintSummaryComponent', () => {
  let component: PrintSummaryComponent;
  let fixture: ComponentFixture<PrintSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
