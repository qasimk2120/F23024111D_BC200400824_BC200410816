import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule,Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export   default class ForgetPasswordComponent implements OnInit {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  forgetForm !: FormGroup;
  fb =inject(FormBuilder)
  errorMessageEmail: string = '';

  ngOnInit():void {
  this.forgetForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])]
      })
  }

  sendEmail(){
    this.authService.sendEmailService(this.forgetForm.value.email).subscribe({
      next: (res)=>{
        this.notificationService.show( 'Email Sent Successfully', 'success');
        this.forgetForm.reset();
      }, error:(err)=>{
        this.notificationService.show( 'Token ', 'error');
      }
    })

  }
}
