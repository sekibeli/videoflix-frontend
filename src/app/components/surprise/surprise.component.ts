import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video.class';
import { ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.scss']
})
export class SurpriseComponent implements OnInit, AfterViewInit, OnDestroy {
  private users: User[] = [];
  autorsName: string = 'Autor';
  selectedVideo: Video | null = null;
  featureVideo!: Video;
  allVideos: Video[] = [];
  videosByCategory: Video[] = [];
  subscription!: Subscription;
  @ViewChild('featureVideoElement') featureVideoElement!: ElementRef;

  constructor(public videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.userService.getUserData();
    this.subscription = this.userService.users$.subscribe(users => {
      this.users = users;
      console.log('Users Array;', this.users);
    });
    this.videoService.videos$.subscribe(videos => {
      this.allVideos = videos;
      this.allVideos.sort((a, b) => b.likes.length - a.likes.length);
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
    }
    console.log('Current FeatureVideo:', this.featureVideo);
    const videoAutor = this.getUserById(this.featureVideo?.id);
    console.log('videoAutor is:', videoAutor);
    this.videosByCategory = this.filterVideosByCategory();
  }


  pauseFeatureVideo() {
    this.featureVideoElement.nativeElement.pause();
  }

  playFeatureVideo() {
    this.featureVideoElement.nativeElement.play();
  }


  filterVideosByCategory(): Video[] {
    return this.allVideos.filter(video => video.category === this.featureVideo?.category);
  }


  onSelectVideo(video: Video): void {
    this.selectedVideo = video;
    console.log('Autosname is:', this.autorsName);
  }


  deleteSelectedVideo() {
    this.selectedVideo = null;
  }


  toggleLikeVideo(videoId: number) {
    this.videoService.toggleLike(videoId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }


  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }


  ngAfterViewInit() {
    const modalElement = document.getElementById('surpriseVideoModal');
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal',this.handleModalClose);
    }
  }

  ngOnDestroy() {
    const modalElement = document.getElementById('surpriseVideoModal');
    if (modalElement) {
      modalElement.removeEventListener('hide.bs.modal', this.handleModalClose);
    }
  }

  private handleModalClose = (event: Event): void => {
    this.selectedVideo = null;
  }

}