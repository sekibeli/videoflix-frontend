import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';
import { VideoService } from 'src/app/services/video.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit, OnDestroy {
  videoId: number | undefined;
video: Video | undefined;
videoLiked!: boolean;
currentUser!: SignupData;
unsubscribe: Subscription | undefined;
editVideoForm!: FormGroup;
submitted = false;
selectedFile: File | null = null;

videoForm = this.formBuilder.group({
  title: ['', Validators.required],
  description: ['', Validators.required],
  category: ['', Validators.required],
  video_file: [null, Validators.required],

});


  constructor(private route: ActivatedRoute, public videoService: VideoService, private authService: AuthService, private formBuilder: FormBuilder, private location: Location){
    
  }
  ngOnInit() {

  




    this.initFormGroup();
    // this.getLoggedUserData();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      // Konvertiere den String zu einem Number und weise ihn zu, falls die Konversion erfolgreich ist
      this.videoId = Number(id);
      console.log(this.videoId);
       this.unsubscribe = this.videoService.getVideobyId(this.videoId).subscribe((video) => {
        this.video = video;
        this.initFormGroup();
       });
      // Überprüfen, ob die Konversion fehlgeschlagen ist (NaN)
      if (isNaN(this.videoId)) {
        this.videoId = undefined; // oder eine andere Fehlerbehandlung
      }
    } else {
      // Setze videoId auf undefined oder führe eine Fehlerbehandlung durch, falls kein ID-Parameter vorhanden ist
      this.videoId = undefined;
    }
  }
 

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
  }



  getSelectedVideo(videoId: number) {
    this.videoService.getVideobyId(videoId).subscribe({
      next: (updatedVideo: Video) => {
        this.video = updatedVideo;
        // this.checkVideoLikes(); 
      },
      error: (error: any) => {
        console.error("Fehler beim Abrufen des aktualisierten Videos", error);
      }
    });
  }

  

  saveChanges(video: Video) {
    if (this.editVideoForm.valid) {
      const formData = new FormData();
      formData.append('title', this.editVideoForm.get('title')?.value);
      formData.append('description', this.editVideoForm.get('description')?.value);
      formData.append('category', this.editVideoForm.get('category')?.value);
   
      const videoId = video.id;
      if (videoId !== undefined) {
        this.videoService.updateVideo(formData, videoId) 
          .subscribe(response => {
            // Hat geklappt
          }, error => {
            // Fehler...
          });
      }

    }
  }
  goBack() {
    this.location.back();
  }

  // onSubmit() { }
  initFormGroup() {
    // Verwenden Sie Video-Daten, falls verfügbar, sonst leere Strings als Standardwerte
    const videoData = this.video || { title: '', description: '', category: '' };
    this.editVideoForm = this.formBuilder.group({
      title: [videoData.title, [Validators.required]],
      description: [videoData.description, [Validators.required]],
      category: [videoData.category, [Validators.required]],
    });
  }

  onUpload() {
    if (this.videoForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.videoForm.value.title ?? '')
      formData.append('description', this.videoForm.value.description ?? '')
      formData.append('video_file', this.selectedFile, this.selectedFile.name);
      formData.append('category', this.videoForm.value.category ?? 'allgemein');

      formData.append('myFile', this.selectedFile, this.selectedFile.name);

      this.videoService.postVideo(formData).subscribe({
        next: (response) => {
          console.log('Video erfolgreich hochgeladen', response);
          this.videoService.getVideos();
        },
        error: (error) => {
          console.log('Fehler beim Hochladen des Videos', error);
        }
      })

    }
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;
    if (file) {
      this.videoForm.patchValue({ video_file: file as any | null });
      this.videoForm.get('video_file')?.updateValueAndValidity();
      this.selectedFile = file; // Ihre bestehende Logik zur Speicherung der Datei
    }
  }

  deleteVideo(videoId: number) {
    this.videoService.deleteVideo(videoId);
  }


}
