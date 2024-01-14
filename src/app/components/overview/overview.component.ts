import { Component, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  selectedVideo: any = null;
  videos = new Array(5);
  videosByCategory: { [category: string]: Video[] } = {};
  private videosByCategorySubject = new BehaviorSubject<{ [category: string]: Video[] }>({});
  public videosByCategory$ = this.videosByCategorySubject.asObservable();



  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.videoService.videos$.subscribe(videos => {
      this.groupVideosByCategory(videos);
    });
  }

  private groupVideosByCategory(videos: Video[]) {
    const categoryGroups: { [category: string]: Video[] } = {};
    videos.forEach(video => {
      if (!categoryGroups[video.category]) {
        categoryGroups[video.category] = [];
      }
      categoryGroups[video.category].push(video);
    });
    this.videosByCategorySubject.next(categoryGroups);
  }

  getCategories(): string[] {
    return Object.keys(this.videosByCategory);
  }

  onSelectVideo(video: Video): void {
    this.selectedVideo = video;
    console.log(this.selectedVideo);
  }

  deleteSelectedVideo() {
    this.selectedVideo = null;
  }

  onModalClose() {
    this.selectedVideo = null;
  }

  deleteVideo(videoId: number) {
    console.log('delete', videoId);
    this.videoService.deleteVideo(videoId);
  }

}
