import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  videoId: number | undefined;
video: Video | undefined;
unsubscribe: Subscription | undefined;


  constructor(private route: ActivatedRoute, public videoService: VideoService){}
  ngOnInit() {
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
}
