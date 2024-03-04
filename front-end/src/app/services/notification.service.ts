import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
}
@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private _notification = new Subject<Notification>();
  notification$ = this._notification.asObservable();

  show(message: string, type: 'success' | 'error') {
    this._notification.next({message, type});

  }
}
