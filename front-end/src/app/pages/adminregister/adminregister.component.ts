import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {NotificationComponent} from "../../components/notification/notification.component";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {confirmPasswordValidator} from "../../validators/confirm-password.validator";

@Component({
  selector: 'app-adminregister',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NotificationComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './adminregister.component.html',
  styleUrl: './adminregister.component.scss'
})
export  default class AdminregisterComponent implements OnInit {
  //Using Injecting to Inject Required services
  authService = inject(AuthService);
  notificationService = inject(NotificationService)
  router = inject(Router); //injecting router
  fb = inject(FormBuilder);  //injecting form builder
  adminRegisterForm  !: FormGroup;//initializing Register form of type FormGroup

  errorMessage: string = '';
  errorMessageEmail: string = '';
  errorMessageUsername: string = '';


  //initializing the form and setting Validators
  ngOnInit(): void {
    this.adminRegisterForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {validator: confirmPasswordValidator('password', 'confirmPassword')})


  }

  adminRegister() {
    this.authService.adminRegisterService(this.adminRegisterForm .value).subscribe({
      next: (res) => {
        this.notificationService.show('Welcome Onboard 🎊, Admin Account Created Successfully, Please login now', 'success');
        this.adminRegisterForm .reset();
        setTimeout(() => {
          this.router.navigate(['admin-login']);
        }, 3700);

      },
      error: (err) => {
        if (err.status === 403) {
          if (err.error.message.includes('Email')) {
            this.errorMessageEmail = 'Email is already in use';
            setTimeout(() => {
              this.errorMessageEmail = '';

            }, 3000); //
          } else if (err.error.message.includes('Username')) {
            this.errorMessageUsername = 'Username is already in use';
            setTimeout(() => {
              this.errorMessageUsername = '';
            }, 3000);
          }
        } else {
          this.errorMessage = 'An unknown error occurred';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000)
        }
      }
    })
  }



}
