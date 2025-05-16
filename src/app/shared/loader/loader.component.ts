import { NgIf, CommonModule, AsyncPipe } from '@angular/common';
// loader.component.ts
import { Component} from '@angular/core';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, AsyncPipe],
  template: `
  <div class="loader-container" *ngIf="loaderService.loading$ | async">
    <div class="blur-backdrop"></div>
    <div class="loader-card">
      <div class="logo-spinner">
        <img src="/assets/RecreatedFIGMAlogo.PNG" alt="Loading" class="logo-core" />
        <div class="spinner-track"></div>
        <div class="spinner-dot-container">
          <div class="spinner-dot"></div>
        </div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

  ngOnInit(): void {
    console.log('Loader component initialized');
  }
}

