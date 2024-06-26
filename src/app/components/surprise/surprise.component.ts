import { Component, OnDestroy, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video.class';
import { ViewChild, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SignupData } from 'src/app/services/user-interface';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.scss']
})
export class SurpriseComponent implements OnInit, OnDestroy {
  private users: User[] = [];
  selectedVideo: Video | null = null;
  featureVideo: Video | null = null;
  allVideos: Video[] = [];
  videosByCategory: Video[] = [];
  subscription!: Subscription;
  currentUser!: SignupData;
  featureVideoLiked!: boolean;
  videoLiked!: boolean;
  likeSubscription!: Subscription;
  videoSubscription!: Subscription;
  featureVideoLikedSubscription!: Subscription;
  selectedVideoLikedSubscription!: Subscription;
  @ViewChild('featureVideoElement') featureVideoElement!: ElementRef;

  constructor(public videoService: VideoService, private userService: UserService, private authService: AuthService, public router: Router) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.userService.getUserData();
    this.subscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.getAllVideos();
    this.checkVideoLikes();
    this.getLoggedUserData();
    this.likeUpdateListener();
  }


  loadFeatureVideo(videos: Video[]) {
    if (videos && videos.length > 0) {
      this.featureVideo = this.selectOrSaveFeatureVideo(videos);

      if (this.currentUser && this.featureVideo) {
        this.checkVideoLikes();
      }

      this.videosByCategory = this.filterVideosByCategory();
    }
  }


  selectOrSaveFeatureVideo(videos: Video[]): Video {
    const savedVideoId = sessionStorage.getItem('featureVideoId');
    let video: Video;

    if (savedVideoId) {
      video = videos.find(v => v.id === parseInt(savedVideoId, 10)) || this.getRandomVideo(videos);
    } else {
      video = this.getRandomVideo(videos);
      sessionStorage.setItem('featureVideoId', video.id.toString());
    }

    return video;
  }


  getRandomVideo(videos: Video[]): Video {
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }



  getAllVideos() {
    this.videoSubscription = this.videoService.videos$.subscribe(videos => {

      this.allVideos = videos;
      this.allVideos.sort((a, b) => b.likes.length - a.likes.length);
      this.loadFeatureVideo(videos);
    });
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
    const videoId = video.id;
    this.getSelectedtVideo(videoId)
    this.selectedVideo = video;
    this.checkVideoLikes();
  }


  deleteSelectedVideo() {
    this.selectedVideo = null;
  }


  toggleLikeFeatureVideo(videoId: number) {
    this.videoService.toggleLike(videoId).subscribe({
      next: (response) => {
        this.getFeatureVideo(videoId);
        this.videoService.notifyLikeUpdate(videoId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  toggleLikeVideo(videoId: number) {
    this.videoService.toggleLike(videoId).subscribe({
      next: (response) => {
        this.getSelectedtVideo(videoId);
        this.videoService.notifyLikeUpdate(videoId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  likeUpdateListener() {
    this.likeSubscription = this.videoService.getLikeUpdateListener().subscribe(updatedVideoId => {
      if (updatedVideoId !== null) {
        this.updateLocalVideoData(updatedVideoId);
      }
    });
  }


  updateLocalVideoData(updatedVideoId: number) {
    if (this.featureVideo && this.featureVideo.id === updatedVideoId) {
      this.getFeatureVideo(updatedVideoId);
    }

    if (this.selectedVideo && this.selectedVideo.id === updatedVideoId) {
      this.getSelectedtVideo(updatedVideoId);
    }

    const index = this.allVideos.findIndex(video => video.id === updatedVideoId);
    if (index !== -1) {
      this.videoService.getVideobyId(updatedVideoId).subscribe(updatedVideo => {
        this.allVideos[index] = updatedVideo;
        this.checkVideoLikes();
      });
    }
  }


  getFeatureVideo(videoId: number) {
    this.featureVideoLikedSubscription = this.videoService.getVideobyId(videoId).subscribe({
      next: (updatedVideo: Video) => {
        this.featureVideo = updatedVideo;
        this.checkVideoLikes();
      },
      error: (error: any) => {
        console.error("Fehler beim Abrufen des aktualisierten Videos", error);
      }
    });
  }


  getSelectedtVideo(videoId: number) {
    this.videoService.getVideobyId(videoId).subscribe({
      next: (updatedVideo: Video) => {
        this.selectedVideo = updatedVideo;
        this.checkVideoLikes();
      },
      error: (error: any) => {
        console.error("Fehler beim Abrufen des aktualisierten Videos", error);
      }
    });
  }


  checkVideoLikes() {
    if (this.featureVideo && this.featureVideo.likes && this.currentUser) {
      this.featureVideoLiked = this.featureVideo.likes.includes(this.currentUser.id);
    }
    if (this.selectedVideo && this.selectedVideo.likes) {
      this.videoLiked = this.selectedVideo.likes.includes(this.currentUser.id);
    }
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


  ngOnDestroy(): void {
    this.likeSubscription?.unsubscribe();
    this.videoSubscription?.unsubscribe();
    this.featureVideoLikedSubscription?.unsubscribe();
    this.selectedVideoLikedSubscription?.unsubscribe();
  }


  onVideoPlay(videoId: number) {
    this.videoService.incrementViewCount(videoId).subscribe(response => {
      console.log('Video hochgezählt');
    });
  }


  viewVideoDetail(videoId: number) {
    this.router.navigate(['/home/detail', videoId])
  }

}