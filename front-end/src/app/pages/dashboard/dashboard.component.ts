import {Component, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../../components/notification/notification.component";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NotificationComponent,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export  default class DashboardComponent {


}
