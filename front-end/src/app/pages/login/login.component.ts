import { Component, OnInit, inject ,} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../../components/notification/notification.component";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterModule,
    NotificationComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {

  //injecting form builder
  fb = inject(FormBuilder)

  //initializing Register form of type FormGroup
  loginForm !: FormGroup
  //Using Injecting to Inject Required services

  //Injecting required services
  authService = inject(AuthService)

  notificationService = inject(NotificationService)

  router = inject(Router);

  errorMessageEmail: string = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    })


  }

  login() {
    this.authService.loginService(this.loginForm.value).subscribe({
      next: (res) => {
        // Check if the user's account is active
        if (res.data.isActive) {
          // Store the user data
          localStorage.setItem("user", JSON.stringify(res.data));
          // Update the authenticated state
          this.authService.isLoggedIn$.next(true);
          // Set isAdmin to false
          this.authService.setAdminStatus(false);
          // Show a success notification
          this.notificationService.show(`Welcome Back ☺️ ${res.data.firstName} ${res.data.lastName} , Taking you to dashboard `, 'success');
          // Navigate to the dashboard after 3 seconds
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 3000);
        } else {
          // If the user's account is not active, redirect them to a separate component
          this.router.navigate(['deactivatedaccount']);
        }
        // Reset the form
        this.loginForm.reset();
      },
      error: (err) => {
        this.notificationService.show(err.error.message, 'error');
      }
    });
  }



}
