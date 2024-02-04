import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss']
})
export class PopularComponent implements OnDestroy {
  private videosTodaySubject = new BehaviorSubject<Video[]>([]);
  public videosToday$ = this.videosTodaySubject.asObservable();
  private videosYesterdaySubject = new BehaviorSubject<Video[]>([]);
  public videosYesterday$ = this.videosYesterdaySubject.asObservable();
  private recentVideosSubject = new BehaviorSubject<Video[]>([]);
  public recentVideos$ = this.recentVideosSubject.asObservable();
  private displayedVideosSubject = new BehaviorSubject<Video[]>([]);
  public displayedVideos$ = this.displayedVideosSubject.asObservable();
  private subscription: Subscription = new Subscription();
  
  constructor(public videoService: VideoService){
    this.getTodayVideos();
    this.getYesterdayVideos();
    this.videoService.getMostLikedVideos();
    this.videoService.getMostSeenVideos();
    this.getRecentVideos();
 
  }

  getTodayVideos(){
    this.videoService.getTodayVideos().subscribe(videos => {
      console.log('Today Videos', videos);
      this.videosTodaySubject.next(videos);
      this.displayedVideosSubject.next(videos);
    })
  }

  getRecentVideos(){
    this.videoService.getRecentVideos().subscribe(videos => {
      console.log('recentVideos: ', videos);
      this.recentVideosSubject.next(videos);
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
      console.log('yesterday Videos:' , videos);
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

toggleDisplayVideos(displayToday: boolean) {
  this.subscription.add(
    (displayToday ? this.videosToday$ : this.videosYesterday$).subscribe(videos => {this.displayedVideosSubject.next(videos);
    console.log('displayes Videos: ', videos)})
  );
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
}
