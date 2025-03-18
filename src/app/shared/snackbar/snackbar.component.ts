import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})

export class SnackbarComponent {
  show = false;
  message = '';
  type: 'success' | 'error' = 'success';

  displayMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.type = type;
    this.show = true;
    console.log('Snackbar Triggered:', msg); // ✅ Debugging

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}
