import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent, CommonModule],
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
