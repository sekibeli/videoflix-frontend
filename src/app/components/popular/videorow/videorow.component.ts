import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { SignupData } from 'src/app/services/user-interface';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-videorow',
  templateUrl: './videorow.component.html',
  styleUrls: ['./videorow.component.scss']
})
export class VideorowComponent {
@Input() videos! : Video[] | null ;
@Output() toggleLikebyUser = new EventEmitter<number>();
selectedVideo!: any ;
videoLiked!: boolean;
currentUser!: SignupData;
private users: User[] = [];
private subscription?: Subscription;

// searchTerm: string = '';
// searchResults: Video[] = [];

constructor(public videoService: VideoService, public userService: UserService, public authService: AuthService){
  this.userService.getUserData();
}


ngOnInit() {
  // this.videoService.getVideos();
  this.getLoggedUserData();
  this.subscription = this.userService.users$.subscribe(users => {
    this.users = users;
  });
  this.checkVideoLikes();
}



onSelectVideo(video: Video): void {
  this.selectedVideo = video;
 
  const videoId = video.id;
  // this.getSelectedVideo(video.id)
   this.checkVideoLikes();
}


deleteSelectedVideo() {
  this.selectedVideo = null;
  // document.body.classList.remove('modal-open');
}


onModalClose() {
  this.selectedVideo = null;
}


deleteVideo(videoId: number) {
  this.videoService.deleteVideo(videoId);
}


toggleLikeVideo(videoId: number) {
  this.toggleLikebyUser.emit(videoId); 
  this.videoService.toggleLike(videoId).subscribe({
    next: (response) => {
      this.getSelectedVideo(videoId);
      this.videoService.getMostSeenVideos();
      this.videoService.getMostLikedVideos();
      // this.videoService.getRecentVideos();
      // this.recentVideoLiked.emit();
      console.log(response);
    },
    error: (error) => {
      console.error(error);
    }
  });
}


getSelectedVideo(videoId: number) {
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

onVideoPlay(videoId: number){
  this.videoService.incrementViewCount(videoId).subscribe(response => {
    console.log('Video hochgezählt');
  });
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

}
