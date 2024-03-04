import {inject, Injectable} from '@angular/core';
import {apiUrls} from "../api.urls";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  http = inject(HttpClient)
  constructor() { }

  fileUploadService(file: File) {
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post<any>(`${apiUrls.pdfFileUploadApi}uploadPDF`,formData);
  }
}
