import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../notification/notification.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements   OnInit {
  showMenu:boolean = false;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  router = inject(Router)
  authService = inject(AuthService)
  notificationService = inject(NotificationService)

  constructor() {
  }


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  logout() {
    // Send a request to a server-side route that clears the HttpOnly cookie
    this.authService.logoutService().subscribe((res) => {
      // Clear all data in localStorage
      localStorage.clear();
      // Update the authenticated state
      this.authService.isLoggedIn$.next(false);
      this.authService._isAdmin.next(false);

      // Navigate to the login page
      this.router.navigate(['/login']);
      // Show a notification with the server's response message
      this.notificationService.show(res.message, 'success');
    });
  }
}
