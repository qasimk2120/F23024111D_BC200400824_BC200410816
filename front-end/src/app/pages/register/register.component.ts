import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {confirmPasswordValidator} from "../../validators/confirm-password.validator";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../../components/notification/notification.component";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NotificationComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export  default class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);  //injecting form builder
  registerForm !: FormGroup;//initializing Register form of type FormGroup

//Using Injecting to Inject Required services
  authService = inject(AuthService);
  notificationService = inject(NotificationService)
  router = inject(Router); //injecting router


  errorMessage: string = '';
  errorMessageEmail: string = '';
  errorMessageUsername: string = '';

  constructor() {

  }

  //initializing the form and setting Validators
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {validator: confirmPasswordValidator('password', 'confirmPassword')})


  }

  register() {
    this.authService.registerService(this.registerForm.value).subscribe({
      next: (res) => {
        this.notificationService.show('Welcome Onboard 🎊, Account Created Successfully, Please login now', 'success');
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['login']);
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
