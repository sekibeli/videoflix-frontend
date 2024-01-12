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

  constructor(public videoService: VideoService) {}

  ngOnInit() {
    this.videoService.getVideos();
//  this.selectVideo(48);
   
  }

  selectVideo(index: number) {
    this.videoService.videos$.subscribe(videos => {
      if (videos && videos.length > index) {
        this.selectedVideo = videos[index];
        console.log(this.selectedVideo);
      }
    });
  }
  
}