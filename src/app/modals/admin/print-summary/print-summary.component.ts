import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FeaturesService } from '../../../features/features.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface LateArrival {
  clockIn: string;
  lateDuration: string;
  isOffseted: boolean;
}

interface OvertimeEntry {
  date: string;
  overtimeDuration: string;
  reason: string | null;
}

interface AttendanceRecord {
  userId: number;
  employeeName: string;
  daysPresent: number;
  daysAbsent: number;
  daysOnLeave: number;
  lateArrivals: LateArrival[];
  earlyDepartures: number;
  totalWorkHours: string;
  overtimeEntries: OvertimeEntry[];
  rawLateCount: number;
  rawLateTime: string;
  otHours: string;
  finalOTHours: string;
  nightDiffHours: string;
  finalLates: number;
  finalLateTime: string;
  mpLsConverted: number;
  mpLsConvertedHours: string;
  // Add fields for used MPL and available MPL if available
}

@Component({
  selector: 'app-print-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './print-summary.component.html',
  styleUrl: './print-summary.component.css'
})
export class PrintSummaryComponent implements OnInit {
  @Input() record: any = {};
  @Output() close = new EventEmitter<void>();
  // Optionally, you can use a ViewChild to reference your modal content for printing.
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;

  ngOnInit(): void {
    // You can perform any initialization here.
    console.log('Record:', this.record);
  }

  selectedSummary = this.record;

  constructor() {}

  closeModal(): void {
    this.close.emit();
  }

  // Helper method to count offset late arrivals
  getOffsetCount(lateArrivals: any[]): number {
    if (!lateArrivals) return 0;
    return lateArrivals.filter(late => late.isOffseted).length;
  }

  // Helper method to calculate total offset hours (assuming lateDuration is in "HH:MM" format)
  getOffsetHours(lateArrivals: any[]): string {
    if (!lateArrivals) return '00:00';
    let totalMinutes = 0;
    lateArrivals.forEach(late => {
      if (late.isOffseted) {
        const [hoursStr, minutesStr] = late.lateDuration.split(':');
        totalMinutes += parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
      }
    });
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs < 10 ? '0' + hrs : hrs}:${mins < 10 ? '0' + mins : mins}`;
  }// Returns the late arrival entry at the given index, or null if it doesn't exist.
  getLateArrival(i: number): any {
    return this.record?.lateArrivals && this.record.lateArrivals.length > i
      ? this.record.lateArrivals[i]
      : null;
  }

  // Returns the overtime entry at the given index, or null if it doesn't exist.
  getOvertime(i: number): any {
    return this.record?.overtimeEntries && this.record.overtimeEntries.length > i
      ? this.record.overtimeEntries[i]
      : null;
  }

  // Returns an array of indexes from 0 to max(row count) - 1.
  getRows(): number[] {
    const lateCount = this.record?.lateArrivals?.length || 0;
    const otCount = this.record?.overtimeEntries?.length || 0;
    const max = Math.max(lateCount, otCount);
    return Array.from({ length: max }, (_, i) => i);
  }

  // Printing logic (unchanged)
  printModalContent(): void {
    const printContents = this.printSection?.nativeElement.innerHTML;
    if (!printContents) return;

    const popupWin = window.open('', '_blank', 'width=800,height=600');
    if (!popupWin) return;

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print Summary for ${this.record?.employeeName || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2, h3, h4 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .modal-actions, .modal-overlay { display: none !important; }
            .summary { page-break-after: always; }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    popupWin.document.close();
  }


}
