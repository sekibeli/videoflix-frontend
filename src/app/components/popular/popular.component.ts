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
  private videosYesterdaySubject = new BehaviorSubject<Video[]>([]);
  public videosYesterday$ = this.videosYesterdaySubject.asObservable();
  
  
  constructor(public videoService: VideoService){
    this.getTodayVideos();
    this.videoService.getMostLikedVideos();
    this.videoService.getMostSeenVideos();
  //  console.log(this.videoService.mostSeenVideos$)
  //   console.log(this.videoService.mostLikedVideos$)
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

  getYesterdayVideos(){
    this.videoService.getYesterdayVideos().subscribe(videos => {
      console.log(videos);
      this.videosYesterdaySubject.next(videos);
    })
  }

  scrollLeft() {
    const container = document.querySelector('.videoRow');
    container?.scrollBy({ left: -200, behavior: 'smooth' }); // Passen Sie den Wert -200 nach Bedarf an
}

scrollRight() {
    const container = document.querySelector('.videoRow');
    container?.scrollBy({ left: 200, behavior: 'smooth' }); // Passen Sie den Wert 200 nach Bedarf an
}
}
