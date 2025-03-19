import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FeaturesService } from '../../features/features.service';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-add-leave-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-leave-request.component.html',
  styleUrl: './add-leave-request.component.css'
})
export class AddLeaveRequestComponent {
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table

  // Hardcoded Leave Types
  leaveTypes = [
    { id: 1, name: 'Vacation' },
    { id: 2, name: 'Sick Leave' },
    { id: 3, name: 'Personal Leave' },
    { id: 4, name: 'Bereavement' },
    { id: 5, name: 'Maternity' },
    { id: 6, name: 'Paternity' }
  ];

  validationMessage: string = '';
  today: string;

  leaveForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {
    this.today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    this.leaveForm = this.fb.group({
      startDate: ['', [Validators.required, this.noPastDatesValidator()]],
      endDate: ['', [Validators.required, this.noPastDatesValidator()]],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', Validators.required] // Dropdown selection
    });

    this.leaveForm.get('type')?.valueChanges.subscribe(value => {
      if (value) {
        this.leaveForm.patchValue({ type: Number(value) }, { emitEvent: false });
      }
    });

    // 🔥 Automatically check for changes and clear the message
    this.leaveForm.valueChanges.subscribe(() => {
      if (this.leaveForm.valid) {
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
    return this.leaveForm.controls[field].touched && this.leaveForm.controls[field].invalid;
  }

  submit() {
    if (this.leaveForm.invalid) {
      this.validationMessage = 'Please fill in all required fields correctly.';
      // 🔥 Force validation errors to show
      Object.keys(this.leaveForm.controls).forEach(field => {
        const control = this.leaveForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    // ✅ Clear validation message if form is valid
    this.validationMessage = '';

    if (this.leaveForm.valid) {
      this.featuresService.addLeaveRequest(this.leaveForm.value).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' && response.data === null) {
            // ❌ Don't close modal if validation error exists
            console.warn('Validation Error:', response.message);
            this.validationMessage = response.message; // Store error message
          } else {
            // ✅ Close modal only if request is truly successful
            console.log('Overtime request submitted successfully:', response);
            this.submitRequest.emit(response);
            this.snackbarService.showSuccess(response.message);
            this.refreshTable.emit(); // ✅ Emit event to refresh table
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error submitting request:', error);
          this.snackbarService.showError('Something went wrong. Please try again.');
        }
      });
    }
  }
}
