import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('snackbar') snackbarComponent!: SnackbarComponent;

  constructor(private snackbarService: SnackbarService) {}

  ngAfterViewInit() {
    this.snackbarService.registerSnackbar(this.snackbarComponent);
  }

  title = 'Laptop-Inventory';


}
