import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss']
})
export class PopularComponent {
  private videosTodaySubject = new BehaviorSubject<Video[]>([]);
  public videosToday$ = this.videosTodaySubject.asObservable();

  
  constructor(public videoService: VideoService){
    this.getTodayVideos();
  }

  getTodayVideos(){
    this.videoService.getTodayVideos().subscribe(videos => {
      console.log(videos);
      this.videosTodaySubject.next(videos);
    })
  }

  onSelectVideo(video: Video): void {
    const videoId = video.id;
    // this.getSelectedtVideo(videoId)
    // this.selectedVideo = video;
    // this.checkVideoLikes();
  }
}
