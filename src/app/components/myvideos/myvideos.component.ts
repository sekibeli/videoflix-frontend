import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-myvideos',
  templateUrl: './myvideos.component.html',
  styleUrls: ['./myvideos.component.scss']
})
export class MyvideosComponent {
  videoForm!: FormGroup;
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  constructor( private formBuilder: FormBuilder, public videoService: VideoService){}
  
  
  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();


      this.videoForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        // description: ['', Validators.required],
        
      }); 
      formData.append('myFile', this.selectedFile, this.selectedFile.name);

      // Hier die URL Ihres Backends einfügen
      const uploadUrl = 'http://yourbackend.com/upload';

      // this.http.post(uploadUrl, formData).subscribe({
      //   next: (response) => console.log(response),
      //   error: (error) => console.log(error)
      // });
    }
  }
}
