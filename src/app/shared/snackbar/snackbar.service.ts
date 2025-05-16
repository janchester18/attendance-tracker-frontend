import { SnackbarComponent } from './snackbar.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbar!: SnackbarComponent;

  registerSnackbar(snackbar: SnackbarComponent) {
    this.snackbar = snackbar;
  }

  showSuccess(message: string) {
    this.snackbar.displayMessage(message, 'success');
  }

  showError(message: string) {
    this.snackbar.displayMessage(message, 'error');
  }
}
