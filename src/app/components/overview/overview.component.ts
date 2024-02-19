import { Component, OnDestroy, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.class';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private users: User[] = [];
  private subscription?: Subscription;
  selectedVideo: any = null;
  videosByCategory: { [category: string]: Video[] } = {};
  private videosByCategorySubject = new BehaviorSubject<{ [category: string]: Video[] }>({});
  public videosByCategory$ = this.videosByCategorySubject.asObservable();
  videoLiked!: boolean;
  currentUser!: SignupData;

  showAllVideosBtn: boolean = false;
  buttonSubscription!: Subscription;


  constructor(private videoService: VideoService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.userService.getUserData();
    this.subscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.videoService.videos$.subscribe(videos => {
      this.groupVideosByCategory(videos);            
    });
    this.checkVideoLikes();
    this.getLoggedUserData();
    // this.showButtonListener();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.buttonSubscription?.unsubscribe();
    const modalElement = document.getElementById('overviewVideoModal');
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
    const videoId = video.id;
    this.getSelectedtVideo(videoId)
    this.selectedVideo = video;
    this.checkVideoLikes();
  }

  deleteSelectedVideo() {
    this.selectedVideo = null;
  }

  onModalClose() {
    this.selectedVideo = null;
  }

  deleteVideo(videoId: number) {
    this.videoService.deleteVideo(videoId);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }


  toggleLikeVideo(videoId: number) {
    this.videoService.toggleLike(videoId).subscribe({
      next: (response) => {
        this.getSelectedtVideo(videoId);
        this.videoService.notifyLikeUpdate(videoId);
        console.log(response);
      },
      error: (error) => {
        console.error(error);
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
    if (this.selectedVideo && this.selectedVideo.likes) {
      this.videoLiked = this.selectedVideo.likes.includes(this.currentUser.id);
    }
  }


  async getLoggedUserData() {
    try {
      this.currentUser = await this.authService.getLoggedUserData();
      if (this.currentUser) {
        this.checkVideoLikes();
      }
    } catch (err) {
      console.error('Could not load user data', err);
    }
  }

  resetSearch() {
    this.videoService.resetFilteredVideos();
    this.showAllVideosBtn = false;
  }
  

  // showButtonListener() {    
  //   this.buttonSubscription = this.videoService.getShowButtonListener().subscribe(() => {
  //     this.showAllVideosBtn = true;
  //   })
  // }

 
  onVideoPlay(videoId: number){
    this.videoService.incrementViewCount(videoId).subscribe(response => {
      console.log('Video hochgezählt');

    });
   
  }
}

