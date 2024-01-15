import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video.class';
import { VideoData } from 'src/app/services/video-interface';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.scss']
})
export class SurpriseComponent implements OnInit {
  selectedVideo: any = null;
  featureVideo!: Video;
  allVideos!: VideoData[];
  videosByCategory!: VideoData[];
  @ViewChild('featureVideoElement') featureVideoElement!: ElementRef;

  constructor(public videoService: VideoService) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.videoService.videos$.subscribe(videos => {
      this.allVideos = videos;
      this.loadFeatureVideo(videos);
    });
  }

  // selectVideo(index: number) {
  //   this.videoService.videos$.subscribe(videos => {
  //     if (videos && videos.length > index) {
  //       this.selectedVideo = videos[index];
  //       console.log(this.selectedVideo);
  //     }
  //   });
  // }


  loadFeatureVideo(videos: Video[]) {
    if (videos && videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      this.featureVideo = videos[randomIndex];
      console.log(this.featureVideo);
    }
    this.videosByCategory = this.filterVideosByCategory();
  }


  pauseFeatureVideo() {
    this.featureVideoElement.nativeElement.pause();
  }

  playFeatureVideo() {
    this.featureVideoElement.nativeElement.play();
  }


  filterVideosByCategory(): VideoData[] {
    return this.allVideos.filter(video => video.category === this.featureVideo.category);
  }


  onSelectVideo(video: any): void {
    this.selectedVideo = video;
    console.log('Selected video is:', this.selectedVideo);
  }


  deleteSelectedVideo() {
    this.selectedVideo = null;
  }


  deleteVideo(videoId: number) {
    console.log('delete', videoId);
    this.videoService.deleteVideo(videoId);
  }

}