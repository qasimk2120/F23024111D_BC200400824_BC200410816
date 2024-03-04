import {inject, Injectable} from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  router  = inject(Router)

  canActivate(): boolean {
    if (localStorage.getItem("admin")) {
      // If the admin is logged in, return true to allow the navigation
      return true;
    } else {
      // If the admin is not logged in, redirect them to the admin login page and return false to cancel the navigation
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}
