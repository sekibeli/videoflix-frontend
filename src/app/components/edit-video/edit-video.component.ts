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

videoForm = this.formBuilder.group({
  title: ['', Validators.required],
  description: ['', Validators.required],
  category: ['', Validators.required],
  video_file: [null, Validators.required],

});


  constructor(private route: ActivatedRoute, public videoService: VideoService, private authService: AuthService, private formBuilder: FormBuilder, private location: Location){}
  ngOnInit() {
    this.getLoggedUserData();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      // Konvertiere den String zu einem Number und weise ihn zu, falls die Konversion erfolgreich ist
      this.videoId = Number(id);
      console.log(this.videoId);
       this.unsubscribe = this.videoService.getVideobyId(this.videoId).subscribe((video) => {
        this.video = video;
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
  onVideoPlay(videoId: number){
    this.videoService.incrementViewCount(videoId).subscribe(response => {
      console.log('Video hochgezählt');
    });   
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
  }

  toggleLikeVideo(videoId: number) {
    this.videoService.toggleLike(videoId).subscribe({
      next: (response) => {
        this.getSelectedVideo(videoId);
        this.videoService.notifyLikeUpdate(videoId);
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSelectedVideo(videoId: number) {
    this.videoService.getVideobyId(videoId).subscribe({
      next: (updatedVideo: Video) => {
        this.video = updatedVideo;
        this.checkVideoLikes(); // Rufe dies nur auf, wenn `updatedVideo` erfolgreich aktualisiert wurde
      },
      error: (error: any) => {
        console.error("Fehler beim Abrufen des aktualisierten Videos", error);
      }
    });
  }

  checkVideoLikes() {
    if (this.video && this.video.likes && this.currentUser && this.currentUser.id !== undefined) {
      this.videoLiked = this.video.likes.includes(this.currentUser.id);
    } else {
      // Behandle den Fall, dass `currentUser` oder `likes` undefined sind
      console.error("currentUser oder likes sind undefined");
    }
  }

  async getLoggedUserData() {
    try {
      this.currentUser = await this.authService.getLoggedUserData();
      if (this.currentUser) {
        this.checkVideoLikes();
      }
    } catch (err) {
      console.error('Could not load user data', err);
    }
  }

  saveChanges(video: Video) {
    if (this.editVideoForm.valid) {
      const formData = new FormData();
      formData.append('title', this.editVideoForm.get('title')?.value);
      formData.append('description', this.editVideoForm.get('description')?.value);
      formData.append('category', this.editVideoForm.get('category')?.value);
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
  goBack() {
    this.location.back();
  }
}
