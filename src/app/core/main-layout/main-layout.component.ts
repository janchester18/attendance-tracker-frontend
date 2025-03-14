import { Component } from "@angular/core";
// import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent,  } from "../header/header.component";

@Component({
  selector: "app-main-layout",
  imports: [HeaderComponent,],
templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent {}
