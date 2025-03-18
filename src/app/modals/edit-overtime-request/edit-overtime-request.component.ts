import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FeaturesService } from '../../features/features.service';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-overtime-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-overtime-request.component.html',
  styleUrl: './edit-overtime-request.component.css'
})
export class EditOvertimeRequestComponent implements OnInit {


  @Input() overtimeData: any | null = null; // 👈 Receive data from parent
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table


  ngOnInit(): void {
    if (this.overtimeData) {
      this.overtimeForm.patchValue({
        date: this.overtimeData.date,
        startTime: this.overtimeData.startTime,
        endTime: this.overtimeData.endTime,
        reason: this.overtimeData.reason,
        expectedOutput: this.overtimeData.expectedOutput
      });
    }
  }

  validationMessage: string = '';
  today: string;

  overtimeForm: FormGroup;

  // ngOnChanges() {
  //   if (this.overtimeData) {
  //     this.overtimeForm.patchValue(this.overtimeData); // 🔥 Pre-fill form
  //   }
  // }

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {
    this.today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    this.overtimeForm = this.fb.group({
      date: [null, [Validators.required, this.noPastDatesValidator()]], // ⬅️ Custom Validator
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      expectedOutput: ['', [Validators.required, Validators.minLength(5)]] // New field added
    });

    // 🔥 Automatically check for changes and clear the message
    this.overtimeForm.valueChanges.subscribe(() => {
      if (this.overtimeForm.valid) {
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
    return this.overtimeForm.controls[field].touched && this.overtimeForm.controls[field].invalid;
  }

  submit() {
    // if (this.overtimeForm.invalid) {
    //   this.validationMessage = 'Please fill in all required fields correctly.';
    //   // 🔥 Force validation errors to show
    //   console.log("asdf");
    //   Object.keys(this.overtimeForm.controls).forEach(field => {
    //     const control = this.overtimeForm.get(field);
    //     control?.markAsTouched({ onlySelf: true });
    //   });
    //   return;
    // }
    // // ✅ Clear validation message if form is valid
    // this.validationMessage = '';

    // if (this.overtimeForm.valid) {
    //   this.featuresService.addLeaveRequest(this.overtimeForm.value).subscribe({
    //     next: (response) => {
    //       if (response.status === 'SUCCESS' && response.data === null) {
    //         // ❌ Don't close modal if validation error exists
    //         console.warn('Validation Error:', response.message);
    //         this.validationMessage = response.message; // Store error message
    //       } else {
    //         // ✅ Close modal only if request is truly successful
    //         console.log('Overtime request submitted successfully:', response);
    //         this.submitRequest.emit(response);
    //         this.snackbarService.showSuccess('Overtime Request Submitted Successfully!');
    //         this.refreshTable.emit(); // ✅ Emit event to refresh table
    //         this.closeModal();
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error submitting request:', error);
    //       this.snackbarService.showSuccess('Something went wrong. Please try again.');
    //   });
    // }
    console.log("Save Changes Button Clicked!")
    this.snackbarService.showSuccess('Save Changes Button Clicked!');
    this.refreshTable.emit(); // ✅ Emit event to refresh table
    this.closeModal();
  }

  cacelOvertimeRequest() {
    console.log("Cancel Overtime Request Button Clicked!");
    this.snackbarService.showSuccess("Cancel Overtime Request Button Clicked!");
    this.closeModal();
  }
}
