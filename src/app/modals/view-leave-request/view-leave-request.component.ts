import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeaturesService } from '../../features/features.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-view-leave-request',
  imports: [CommonModule],
  templateUrl: './view-leave-request.component.html',
  styleUrl: './view-leave-request.component.css',
  providers: [DatePipe],

})
export class ViewLeaveRequestComponent {
  @Input() leaveData: any = null; // Receive overtime request data
  @Output() close = new EventEmitter<void>(); // Emits event to close modal

  constructor(
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe
  ) {}

  closeModal() {
    this.close.emit(); // Notify parent component to close modal
  }
}
