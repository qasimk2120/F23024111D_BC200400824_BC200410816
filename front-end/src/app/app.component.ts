import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit {
  authService = inject(AuthService)
  title = 'Edit-Masters';
  router = inject(Router)
  ngOnInit() {
    this.authService.initAuthState();
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');

    if (user) {
      this.router.navigate(['/dashboard']);
    } else if (admin) {
      this.router.navigate(['/admin-dashboard']);
    }

  }
}
