import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NotificationComponent} from "../notification/notification.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NotificationComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {

}
