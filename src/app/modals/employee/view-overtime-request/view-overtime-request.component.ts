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
    this.overtimeData.startTime = this.convertTime(this.overtimeData.startTime);
    this.overtimeData.endTime = this.convertTime(this.overtimeData.endTime);
  }

  convertTime(timeString: string): string {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return this.datePipe.transform(date, 'hh:mm a') || timeString;
  }

  closeModal() {
    this.close.emit(); // Notify parent component to close modal
  }
}
