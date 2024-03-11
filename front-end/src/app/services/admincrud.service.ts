import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { apiUrls } from "../api.urls";

@Injectable({
  providedIn: 'root'
})
export class AdmincrudService {

  http = inject(HttpClient)


  getAllUsers() {
    return this.http.get<any>('http://localhost:8000/api/users/getall', {withCredentials: true});
  }


  updateUser(id: string, user: any) {

    return this.http.put<any>(`${apiUrls.crudapi}/${id}`, user, {withCredentials: true});
  }

  activateUser(id: string) {
    return this.http.put<any>(`${apiUrls.crudapi}/${id}/activate`, {}, {withCredentials: true});
  }

  deactivateUser(id: string) {
    return this.http.put<any>(`${apiUrls.crudapi}/${id}/deactivate`, {}, {withCredentials: true});
  }
}
