import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FeaturesService } from '../../../features/features.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

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

interface AttendanceSummary {
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
  startDate: string;
  endDate: string;
  // Add fields for used MPL and available MPL if available
}

@Component({
  selector: 'app-print-emp-summary',
  imports: [CommonModule, MatDividerModule],
  templateUrl: './print-emp-summary.component.html',
  styleUrl: './print-emp-summary.component.css'
})
export class PrintEmpSummaryComponent implements OnInit {
  @Input() allSummaries: AttendanceSummary[] = [];
  @Output() close = new EventEmitter<void>();
  // Optionally, you can use a ViewChild to reference your modal content for printing.
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;

  ngOnInit(): void {
    // You can perform any initialization here.
    console.log('Record:', this.allSummaries);
  }

  selectedSummary = this.allSummaries;

  constructor() {}

  // Helper methods (same as in your single modal)
  getOffsetCount(lateArrivals: any[]): number {
    return lateArrivals ? lateArrivals.filter(late => late.isOffseted).length : 0;
  }

  getOffsetHours(lateArrivals: any[]): string {
    if (!lateArrivals) return '00:00';
    let totalMinutes = 0;
    lateArrivals.forEach(late => {
      if (late.isOffseted) {
        const parts = late.lateDuration.split(':');
        totalMinutes += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  // For dynamic detail rows for tardiness and overtime per record
  getRows(record: AttendanceSummary): number[] {
    const lateCount = record.lateArrivals ? record.lateArrivals.length : 0;
    const otCount = record.overtimeEntries ? record.overtimeEntries.length : 0;
    const max = Math.max(lateCount, otCount);
    return Array.from({ length: max }, (_, i) => i);
  }

  getLateArrival(record: AttendanceSummary, i: number): any {
    return record.lateArrivals && record.lateArrivals.length > i ? record.lateArrivals[i] : null;
  }

  getOvertime(record: AttendanceSummary, i: number): any {
    return record.overtimeEntries && record.overtimeEntries.length > i ? record.overtimeEntries[i] : null;
  }

  printModalContent(): void {
    const printContents = this.printSection?.nativeElement.innerHTML;
    if (!printContents) return;

    const popupWin = window.open('', '_blank', 'width=800,height=600');
    if (!popupWin) return;

    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>All Attendance Summaries</title>
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
              setTimeout(() => {
                window.print();
              }, 500);
              setTimeout(() => {
                window.close();
              }, 2000);
            };
          </script>
        </body>
      </html>
    `);
    popupWin.document.close();
  }


  closeModal(): void {
    this.close.emit();
  }
}
