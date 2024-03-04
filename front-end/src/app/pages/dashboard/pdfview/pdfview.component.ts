import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import WebViewer from "@pdftron/webviewer";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-pdfview',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './pdfview.component.html',
  styleUrl: './pdfview.component.scss'
})
export default class  PdfviewComponent implements AfterViewInit{
  @ViewChild('viewer') viewerRef!: ElementRef;

 ngAfterViewInit() {
   const pdfUrl = localStorage.getItem('lastUploadedPdfUrl') || 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf';// Get file extension from url

  WebViewer({
  path:'../../../assets/lib',
  initialDoc: pdfUrl,
    extension: 'pdf'
  },this.viewerRef.nativeElement).then(instance => {

  });
 }
}
