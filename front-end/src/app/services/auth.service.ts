import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiUrls} from "../api.urls";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Managing admin navigations so that admin is routed to his dashboard and links are updated accordingly
  _isAdmin = new BehaviorSubject<boolean>(false);
  readonly isAdmin$ = this._isAdmin.asObservable();
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  http = inject(HttpClient)
  //Restoring admin or user logged in status if access token/cookie available in local storage


  initAuthState() {
    const userItem = localStorage.getItem('user');
    const adminItem = localStorage.getItem('admin');

    if (userItem) {
      const user = JSON.parse(userItem);
      this.isLoggedIn$.next(true);
      this.setAdminStatus(false);
    } else if (adminItem) {
      const admin = JSON.parse(adminItem);
      console.log(admin);
      this.isLoggedIn$.next(true);
      this.setAdminStatus(true);
    }
  }
  setAdminStatus(status: boolean) {
    this._isAdmin.next(status);
  }

  adminRegisterService(registerObj: any){
    return this.http.post<any>(`${apiUrls.authServiceApi}admin-register`,registerObj)
  }
  loginAdminService(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}admin-login`,loginObj, { withCredentials: true });
  }
  registerService(registerObj: any){
    return this.http.post<any>(`${apiUrls.authServiceApi}register`,registerObj);
  }
  loginService(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}login`,loginObj, { withCredentials: true });

  }



  sendEmailService(email:string){
    return this.http.post<any>(`${apiUrls.authServiceApi}send-email`, {email:email});
  }
  resetPasswordService(resetObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}reset-password`, resetObj);

  }
  logoutService() {
    //endpoint for logout
    return this.http.post<any>(`${apiUrls.authServiceApi}logout`,{});
  }
}
