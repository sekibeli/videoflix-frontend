import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';
import { VideoService } from 'src/app/services/video.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  videoId: number | undefined;
video: Video | undefined;
videoLiked!: boolean;
currentUser!: SignupData;
unsubscribe: Subscription | undefined;


  constructor(private route: ActivatedRoute, public videoService: VideoService, private authService: AuthService, private location: Location){}
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

  goBack() {
    this.location.back();
  }
}
