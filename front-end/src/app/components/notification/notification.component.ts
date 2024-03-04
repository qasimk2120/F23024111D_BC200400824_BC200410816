import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule]
})
export class NotificationComponent implements OnInit, OnDestroy {

  notificationService = inject(NotificationService)
  notification: Notification | null = null;
  subscription: Subscription = new Subscription();



  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe((notification: Notification) => {
      this.notification = notification;
      setTimeout(() => this.notification = null, 4000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


