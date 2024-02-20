import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  videos$ = this.videoService.searchResults.asObservable();
  selectedVideo: any = null;
  videoLiked!: boolean;
  currentUser!: SignupData;

  private subscription?: Subscription;
  private users: User[] = [];


  constructor(
    public videoService: VideoService,
    private userService: UserService,
    private authService: AuthService) { }


  ngOnInit() {
    this.userService.getUserData();
    this.subscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.checkVideoLikes();
    this.getLoggedUserData();
  }


  onSelectVideo(video: Video): void {
    const videoId = video.id;
    this.getSelectedtVideo(videoId)
    this.selectedVideo = video;
    this.checkVideoLikes();
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


  onVideoPlay(videoId: number){
    this.videoService.incrementViewCount(videoId).subscribe(response => {
      console.log('Video hochgezählt');
    });   
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

}
