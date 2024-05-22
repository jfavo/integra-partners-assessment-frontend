import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule]
})
export class NavbarComponent {

  constructor(private router: Router) { }

  /**
   * Retrieves the current pages route url
   * @returns The current url
   */
  getCurrentUrl(): string {
    return this.router.url;
  }

  /**
   * Navigates to 
   * @param url 
   */
  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
