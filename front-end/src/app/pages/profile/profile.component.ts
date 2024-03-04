import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent implements OnInit {
  user: any

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'||'admin')!);
  }
}
