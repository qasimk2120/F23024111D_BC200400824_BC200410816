import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";

export const routes: Routes = [
  {path: '', loadComponent: () => import('./components/home/home.component')},
  {path: 'home', loadComponent: () => import('./components/home/home.component')},
  {path: 'login', loadComponent: () => import('./pages/login/login.component')},
  {path: 'register', loadComponent: () => import('./pages/register/register.component') },
  {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component'), canActivate: [AuthGuard] },
  {path: 'pdfupload', loadComponent: () => import('./pages/dashboard/pdf-upload/pdf-upload.component'), canActivate: [AuthGuard]},
  {path: 'pdfview', loadComponent: () => import('./pages/dashboard/pdfview/pdfview.component'), canActivate: [AuthGuard]},
  {path: 'profile', loadComponent: () => import('./pages/profile/profile.component'), canActivate: [AuthGuard]},
  {path: 'forget-password', loadComponent: () => import('./pages/forget-password/forget-password.component')},
  {path: 'reset/:token', loadComponent: () => import('./pages/reset/reset.component')},
  {path: 'deactivatedaccount', loadComponent: () => import('./pages/deactivatedaccount/deactivatedaccount.component')},
  {path: 'admin-register', loadComponent: () => import('./pages/adminregister/adminregister.component')},
  {path: 'admin-login', loadComponent: () => import('./pages/adminlogin/adminlogin.component')},
  {path: 'admin-dashboard', loadComponent: () => import('./pages/admindashboard/admindashboard.component'), canActivate: [AdminGuard]},
  {path: 'admin-profile', loadComponent: () => import('./pages/adminprofile/adminprofile.component'), canActivate: [AdminGuard]},
  {path: '**', loadComponent: () => import('./pages/pagenotfound/pagenotfound.component')}
];
