import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterModule} from "@angular/router";
import {NotificationComponent} from "../notification/notification.component";
import {FooterComponent} from "../footer/footer.component";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {AsyncPipe, CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NotificationComponent,
    FooterComponent,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  constructor(private authService: AuthService){

  }
  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

}
