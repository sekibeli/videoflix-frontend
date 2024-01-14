import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video.class';


@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.scss']
})
export class SurpriseComponent implements OnInit {
  selectedVideo: Video | undefined;
  featureVideo!: Video;

  constructor(public videoService: VideoService) { }

  ngOnInit() {
    this.videoService.getVideos();
    // this.selectVideo(48);
      this.videoService.getVideos();
      this.videoService.videos$.subscribe(videos => {
        this.loadFeatureVideo(videos);
      });
  }

  selectVideo(index: number) {
    this.videoService.videos$.subscribe(videos => {
      if (videos && videos.length > index) {
        this.selectedVideo = videos[index];
        this.loadFeatureVideo(videos);
        console.log(this.selectedVideo);
      }
    });
  }


  loadFeatureVideo(videos: Video[]) {
    if (videos && videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      this.featureVideo = videos[randomIndex];
    }
  }

}