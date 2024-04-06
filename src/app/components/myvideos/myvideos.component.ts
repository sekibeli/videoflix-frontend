import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.class';
import { Video } from 'src/app/models/video.class';

declare var bootstrap: any;
@Component({
  selector: 'app-myvideos',
  templateUrl: './myvideos.component.html',
  styleUrls: ['./myvideos.component.scss']
})
export class MyvideosComponent implements OnInit {
  submitted = false;
  editVideoForm!: FormGroup;
  selectedVideo: any = null;
  userProfile?: any;
  myVideos: Video[] = [];
  selectedFile: File | null = null;
  filmRatings = Array.from({ length: 19 }, (v, k) => k);
  curentfilmRating: number = 0;
  currentCategory: string = 'allgemein';
  // videoForm!: FormGroup;
  showUploadMessage: boolean = false;
  uploadMessage: string = '';
  @ViewChild('fileInput') fileInputVariable: ElementRef | undefined;

  videoForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    video_file: [null, Validators.required],
    film_rating: [0, Validators.required]
  });  


  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;
    if (file) {
      this.videoForm.patchValue({ video_file: file as any | null });
      this.videoForm.get('video_file')?.updateValueAndValidity();
      this.selectedFile = file; // Ihre bestehende Logik zur Speicherung der Datei
    }
  }

  constructor(private formBuilder: FormBuilder, public videoService: VideoService, private authService: AuthService) {

  }

  ngOnInit() {
    this.videoService.getVideos();
    this.initFormGroup();
    this.loadMyVideos();


  }


  async loadMyVideos() {
    // Benutzerdaten abrufen
    const userProfile = await this.authService.getLoggedUserData();
    this.userProfile = userProfile;
    const userId = this.userProfile.id;
    // Auf Änderungen in videosSubject reagieren
    this.videoService.videos$.subscribe(videos => {

      // Filtern der Videos, die vom eingeloggten Benutzer erstellt wurden
      this.myVideos = videos.filter(video => video.created_from === userId);
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
      formData.append('film_rating', this.videoForm.value.film_rating?.toString() ?? '0');

      this.videoService.postVideo(formData).subscribe({
        next: (response) => {
          console.log('Video erfolgreich hochgeladen', response);
          this.videoForm.reset();
          this.selectedFile = null;
          this.curentfilmRating = 0;
          this.currentCategory = 'allgemein'; 
          this.showUploadMessage = true;
          if(this.fileInputVariable && this.fileInputVariable.nativeElement) {
            this.fileInputVariable.nativeElement.value = ""; 
          }
          this.uploadMessage = 'Vielen Dank für den Upload eines neuen Videos. Wir schalten es nach Überprüfung frei. Dies kann bis zu 24 Stunden dauern.';
          
          setTimeout(() => {
            this.showUploadMessage = false;
            this.uploadMessage = '';
          }, 6000); 
          this.videoService.getVideos();
        },
        error: (error) => {
          console.log('Fehler beim Hochladen des Videos', error);
        }
      })

    }
  }

  deleteVideo(videoId: number) {
    this.videoService.deleteVideo(videoId);
  }

  deleteSelectedVideo() {
    this.selectedVideo = null;
  }

  onSelectVideo(video: Video): void {
    this.selectedVideo = video;
  }

  async showVideoData(videoData: Video) {
    try {
      // const videoData = await this.videoService.getVideos();
      this.selectedVideo = videoData;
      this.editVideoForm.patchValue({
        category: videoData.category,
        title: videoData.title,
        description: videoData.description

      })

    } catch (err) {
      console.error('Could not load user data', err);
    }
  }

  initFormGroup() {
    this.editVideoForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      film_rating: ['', [Validators.required]],
    })
  }



  saveChanges(video: Video) {
    if (this.editVideoForm.valid) {
      const formData = new FormData();
      formData.append('title', this.editVideoForm.get('title')?.value);
      formData.append('description', this.editVideoForm.get('description')?.value);
      formData.append('category', this.editVideoForm.get('category')?.value);
      formData.append('film_rating', this.editVideoForm.get('film_rating')?.value);
      // Fügen Sie hier ggf. weitere Felder hinzu

      // Wenn Sie eine Datei hochladen, fügen Sie diese auch hinzu
      // Beispiel: formData.append('video_file', this.selectedFile);
      const videoId = video.id;
      if (videoId !== undefined) {
        this.videoService.updateVideo(formData, videoId) // Ersetzen Sie 'videoId' durch die tatsächliche Video-ID
          .subscribe(response => {
            // Erfolg: Handhaben Sie die Antwort hier
          }, error => {
            // Fehler: Handhaben Sie Fehlerfälle hier
          });
      }

    }
  }

  // closeModal() {
  //   const modalElement = document.getElementById('editModal');
  //   const modal = bootstrap.Modal.getInstance(modalElement);
  //   modal.hide();
  // }


  selectRating(rating: number) {
    const filmRatingControl = this.videoForm.get('film_rating');
    if (filmRatingControl) {
      filmRatingControl.setValue(rating);
      this.curentfilmRating = rating;
    }
  }  


  selectCategory(category: string) {
    const categoryControl = this.videoForm.get('category');
    if (categoryControl) {
      categoryControl.setValue(category);
      this.currentCategory = category;
    }
  }
}
