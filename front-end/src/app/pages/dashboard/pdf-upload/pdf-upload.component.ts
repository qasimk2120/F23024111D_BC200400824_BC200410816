import { Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../../services/notification.service";
import {NotificationComponent} from "../../../components/notification/notification.component";
import {FileuploadService} from "../../../services/fileupload.service";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [
    NotificationComponent, CommonModule
  ],
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
})
export default class PdfUploadComponent {
  router = inject(Router)
  http = inject(HttpClient)
  fileService = inject(FileuploadService)
  notificationService = inject(NotificationService)
  isFileUploaded = false;


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files != null) {
      const file: File = inputElement.files[0];
      const fileExtension = file.name.split('.').pop();
      if (fileExtension?.toLowerCase() === 'pdf') {
        this.uploadFile(file);
      } else {
        this.notificationService.show('Please Upload PDF only', 'error');
      }
    }
  }

  uploadFile(file: File) {
    this.fileService.fileUploadService(file).subscribe(
      response => {
        this.isFileUploaded = true;

        //Saving the URL of the uploaded PDF
        const newFilename = response.data.filename;
        const pdfUrl = `http://localhost:8000/pdf/${newFilename}`;
        localStorage.setItem('lastUploadedPdfUrl', pdfUrl);
        setTimeout(() => {
          this.router.navigate(['pdfview']);
        }, 5000);
        this.notificationService.show(`File Uploaded Successfully: ${file.name}`, 'success');
        // Reset the file input after the upload is complete
        const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      },
      error => {
        this.notificationService.show('File Upload failed', 'error');
      }
    );
  }
}
