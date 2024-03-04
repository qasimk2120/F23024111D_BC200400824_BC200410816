import { Component, OnInit, inject } from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../../components/notification/notification.component";
import {CookieService} from "ngx-cookie-service";
import {AdmincrudService} from "../../services/admincrud.service";


@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterModule,
    NotificationComponent,
  ],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.scss'
})
export  default class AdminloginComponent implements OnInit {
  fb = inject(FormBuilder)

  //initializing Register form of type FormGroup
  adminloginForm !: FormGroup
  //Using Injecting to Inject Required services
  cookieService = inject(CookieService)
  //Injecting required services
  authService = inject(AuthService)

  adminCrudService = inject(AdmincrudService)
  notificationService = inject(NotificationService)

  router = inject(Router);

  errorMessageEmail: string = '';

  ngOnInit(): void {
    this.adminloginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    })


  }
  adminlogin() {
    this.authService.loginAdminService(this.adminloginForm.value).subscribe({
      next: (res) => {

        // Check if the response includes a token
        const token = res.data.token;
        localStorage.setItem("admin", JSON.stringify(res.data));
        // Update the authenticated state
        this.authService.isLoggedIn$.next(true);
        // Set isAdmin to true
        this.authService.setAdminStatus(true);
        // Show a success notification
        this.notificationService.show(`Welcome Back ☺️ ${res.data.firstName} ${res.data.lastName} , Taking you to admin dashboard `, 'success');
        // Navigate to the admin dashboard after 3 seconds
        setTimeout(() => {
          this.router.navigate(['admin-dashboard']);
        }, 2000);

        // Reset the form
        this.adminloginForm.reset();
      },
      error: (err) => {
        this.notificationService.show(err.error.message, 'error');
      }
    })
  }
}
