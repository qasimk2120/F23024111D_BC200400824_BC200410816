import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-adminprofile',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './adminprofile.component.html',
  styleUrl: './adminprofile.component.scss'
})
export default class AdminprofileComponent implements OnInit {
  admin : any

  ngOnInit(): void {
    this.admin = JSON.parse(localStorage.getItem('admin')!);
  }

}
