import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {confirmPasswordValidator} from "../../../validators/confirm-password.validator";
import {AuthService} from "../../../services/auth.service";
import {NotificationService} from "../../../services/notification.service";
import {NotificationComponent} from "../../../components/notification/notification.component";

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NotificationComponent,
    RouterLink
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export default class ResetComponent implements OnInit {
  authService = inject(AuthService)
  activatedRoute = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  router = inject(Router);

  resetForm !: FormGroup;
  fb = inject(FormBuilder);


  token!: string;

  ngOnInit() {
    this.resetForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: confirmPasswordValidator('password', 'confirmPassword')})

    //Getting value of the token from the hyperlink
    this.activatedRoute.params.subscribe(val => {
      this.token = val['token']
    })


  }



  reset() {
    let resetObj = {
      token: this.token,
      newPassword: this.resetForm.value.password
    }

    this.authService.resetPasswordService(resetObj).subscribe({
      next: (res) => {
        this.notificationService.show( res.message, 'success');
        this.resetForm.reset();
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 4000);
      }, error: () => {
        this.notificationService.show('Password Reset Link Expired, Please Re-apply for Password Recovery', 'error');
      }
    })

  }
}
