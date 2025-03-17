import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from "../../shared/snackbar/snackbar.component";

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, SnackbarComponent, SnackbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  time: string = '';

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Update clock every second
  }

  updateTime() {
    const now = new Date();
    this.time = now.toLocaleTimeString();
  }

  clockIn() {
    console.log('Clock In clicked');
  }

  startBreak() {
    console.log('Start Break clicked');
  }

  endBreak() {
    console.log('End Break clicked');
  }

  clockOut() {
    console.log('Clock Out clicked');
  }
}
