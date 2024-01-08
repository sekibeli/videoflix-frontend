import { Component, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
videos = new Array(5);
videosByCategory: { [category: string]: Video[] } = {};


constructor(private videoService:VideoService){}

ngOnInit() {
  this.videoService.getVideos();
  this.videoService.videos$.subscribe(videos => {
    this.groupVideosByCategory(videos);
  });
}

private groupVideosByCategory(videos: Video[]) {
  videos.forEach(video => {
    if (!this.videosByCategory[video.category]) {
      this.videosByCategory[video.category] = [];
    }
    this.videosByCategory[video.category].push(video);
  });
}

getCategories(): string[] {
  return Object.keys(this.videosByCategory);
}
}
