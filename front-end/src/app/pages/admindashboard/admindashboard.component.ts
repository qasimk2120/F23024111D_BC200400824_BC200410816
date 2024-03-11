import {Component, inject, OnInit} from '@angular/core';
import { AdmincrudService } from "../../services/admincrud.service";
import { CommonModule } from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.scss'
})
export default class AdmindashboardComponent implements OnInit {
  notificationService = inject(NotificationService)
  adminCrudService = inject(AdmincrudService)

  isEditing: boolean = false;
  users: any[] = [];
  userToUpdate: any = {};

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.adminCrudService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data
      },
      error: (error) => {
        this.notificationService.show(error.message, 'error');
      }
    });
  }
  activateUser(id: string) {
    this.adminCrudService.activateUser(id).subscribe({
      next: (response) => {
        this.notificationService.show(response.message, 'success');
        this.getAllUsers();
      },
      error: (error) => {
        this.notificationService.show(error.message, 'error');
      }
    });
  }

  deactivateUser(id: string) {
    this.adminCrudService.deactivateUser(id).subscribe({
      next: (response) => {
        this.notificationService.show(response.message, 'success');
        this.getAllUsers();
      },
      error: (error) => {
        this.notificationService.show(error.message, 'error');
      }
    });
  }
  updateUser(id: string) {
    this.adminCrudService.updateUser(id, this.userToUpdate).subscribe({
      next: (response) => {
        this.notificationService.show(response.message, 'success');
        setTimeout(() => {
          this.resetUpdateForm();
          this.getAllUsers();
          }, 2000);
      },
      error: (error) => {
        this.notificationService.show(error.message, 'error');
      }
    });
  }



  populateUpdateForm(user: any) {
    this.userToUpdate = { ...user };
    this.isEditing = true;
  }

  resetUpdateForm() {
    this.userToUpdate = {};
    this.isEditing = false;
  }
}
