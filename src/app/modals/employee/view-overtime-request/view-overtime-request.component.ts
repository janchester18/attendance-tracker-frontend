import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeaturesService } from '../../../features/features.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-view-overtime-request',
  imports: [CommonModule],
  templateUrl: './view-overtime-request.component.html',
  styleUrl: './view-overtime-request.component.css',
  providers: [DatePipe],
})
export class ViewOvertimeRequestComponent implements OnInit {
  @Input() overtimeData: any = null; // Receive overtime request data
  @Output() close = new EventEmitter<void>(); // Emits event to close modal

  constructor(
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    if (this.overtimeData) {
      this.overtimeData.startTime = this.convertTime(this.overtimeData.startTime);
      this.overtimeData.endTime = this.convertTime(this.overtimeData.endTime);
    }
  }

  convertTime(timeString: string | null | undefined): string {
    if (!timeString) {
      console.warn('Invalid time format:', timeString);
      return 'Invalid Time';
    }

    // Handle 12-hour format with AM/PM directly
    const time = new Date(`1970-01-01 ${timeString}`);
    if (isNaN(time.getTime())) {
      console.warn('Invalid time values:', timeString);
      return 'Invalid Time';
    }

    return this.datePipe.transform(time, 'hh:mm a') || 'Invalid Time';
  }


  closeModal() {
    this.close.emit(); // Notify parent component to close modal
  }
}
