import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video.class';
import { ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SignupData } from 'src/app/services/user-interface';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.scss']
})
export class SurpriseComponent implements OnInit {
  private users: User[] = [];
  autorsName: string = 'Autor';
  selectedVideo: Video | null = null;
  featureVideo!: Video;
  allVideos: Video[] = [];
  videosByCategory: Video[] = [];
  subscription!: Subscription;
  currentUser!: SignupData;
  videoLiked!: boolean;
  @ViewChild('featureVideoElement') featureVideoElement!: ElementRef;

  constructor(public videoService: VideoService, private userService: UserService, private authService: AuthService) { }

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
    this.getLoggedUserData();
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
    if (this.currentUser && this.featureVideo) {
      this.checkVideoLikes();
    }
    console.log('Current FeatureVideo:', this.featureVideo);
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
        this.checkVideoLikes();
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


  checkVideoLikes() {
    if (this.featureVideo && this.featureVideo.likes && this.currentUser) {
      this.videoLiked = this.featureVideo.likes.includes(this.currentUser.id);
    } else {
      this.videoLiked = false;
    }
    console.log('is video liked?', this.videoLiked);
  }


  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }


  async getLoggedUserData() {
    try {
      this.currentUser = await this.authService.getLoggedUserData();
      if (this.currentUser && this.featureVideo) {
        this.checkVideoLikes();
      }
    } catch (err) {
      console.error('Could not load user data', err);
    }
  }

}