import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule],
  template: `
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button routerLink="/">Go to Login</button>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      margin-top: 100px;
    }
  `]
})
export class NotFoundComponent {}
