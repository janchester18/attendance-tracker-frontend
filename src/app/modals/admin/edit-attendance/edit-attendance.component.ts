import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FeaturesService } from '../../../features/features.service';
import { SnackbarComponent } from '../../../shared/snackbar/snackbar.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-attendance',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-attendance.component.html',
  styleUrl: './edit-attendance.component.css'
})
export class EditAttendanceComponent implements OnInit {
  @Input() attendanceData: any | null = null; // 👈 Receive data from parent
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table


  ngOnInit(): void {
    if (this.attendanceData) {
      this.attendanceForm.patchValue({
        clockIn: this.formatTime(this.attendanceData.clockIn),
        breakStart: this.formatTime(this.attendanceData.breakStart),
        breakFinish: this.formatTime(this.attendanceData.breakFinish),
        clockOut: this.formatTime(this.attendanceData.clockOut),
      });
    }
  }

  validationMessage: string = '';
  today: string;

  attendanceForm!: FormGroup;

  // ngOnChanges() {
  //   if (this.overtimeData) {
  //     this.overtimeForm.patchValue(this.overtimeData); // 🔥 Pre-fill form
  //   }
  // }

  // ✅ This ensures that when `leaveData` updates, the form updates as well
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attendanceData'] && this.attendanceData) {
      this.attendanceForm.patchValue({
        clockIn: this.formatTime(this.attendanceData.clockIn),
        breakStart: this.formatTime(this.attendanceData.breakStart),
        breakFinish: this.formatTime(this.attendanceData.breakFinish),
        clockOut: this.formatTime(this.attendanceData.clockOut),
      });
      console.log('Updated Form Values:', this.attendanceForm.value); // Debugging
    }
  }

  // Convert datetime string to HH:mm format (for input type="time")
  private formatTime(dateTime: string | null): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toTimeString().slice(0, 5); // Extract HH:mm
  }

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {
    this.today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    this.attendanceForm = this.fb.group({
      clockIn: [''], // Add this
      breakStart: [''], // Add this
      breakFinish: [''], // Add this
      clockOut: [''], // Add thi
    });

    // 🔥 Automatically check for changes and clear the message
    this.attendanceForm.valueChanges.subscribe(() => {
      if (this.attendanceForm.valid) {
        this.validationMessage = '';
      }
    });

  }

  // ⬇️ Custom Validator to Prevent Past Dates
noPastDatesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // If empty, let required validator handle it

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

    return selectedDate < today ? { pastDate: true } : null; // ❌ Invalid if past date
  };
}

  closeModal() {
    this.close.emit(); // Notify parent component to close modal

  }

  isInvalid(field: string): boolean {
    return this.attendanceForm.controls[field].touched && this.attendanceForm.controls[field].invalid;
  }

  submit() {
    if (this.attendanceForm.invalid) {
      this.validationMessage = 'Please fill in all required fields correctly.';
      Object.keys(this.attendanceForm.controls).forEach(field => {
        const control = this.attendanceForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.validationMessage = '';

    if (!this.attendanceData || !this.attendanceData.id) {
      this.snackbarService.showError("Error: No attendance record selected.");
      return;
    }

    const id = this.attendanceData.id;

    // ✅ Format the time fields properly
    const formData = {
      clockIn: this.formatTimeForBackend(this.attendanceForm.value.clockIn),
      breakStart: this.formatTimeForBackend(this.attendanceForm.value.breakStart),
      breakFinish: this.formatTimeForBackend(this.attendanceForm.value.breakFinish),
      clockOut: this.formatTimeForBackend(this.attendanceForm.value.clockOut),
    };

    console.log("Submitting data:", formData); // Debugging

    this.featuresService.updateAttendance(id, formData).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data === null) {
          console.warn('Validation Error:', response.message);
          this.validationMessage = response.message;
        } else {
          this.snackbarService.showSuccess(response.message);
          this.refreshTable.emit();
          this.closeModal();
        }
      },
      error: (error) => {
        this.snackbarService.showError(error);
      }
    });
  }

  private formatTimeForBackend(time: string | null): string | null {
    if (!time) return null; // Convert empty string to null
    return time.length === 5 ? `${time}:00` : time; // Convert "HH:mm" to "HH:mm:ss"
  }

}
