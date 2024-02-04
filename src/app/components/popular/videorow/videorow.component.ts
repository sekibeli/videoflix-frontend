import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { Video } from 'src/app/models/video.class';
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
selectedVideo: any = null;
videoLiked!: boolean;
currentUser!: SignupData;
private users: User[] = [];
private subscription?: Subscription;

constructor(public videoService: VideoService, public userService: UserService){
  this.userService.getUserData();
}


ngOnInit() {
  // this.videoService.getVideos();
  
  this.subscription = this.userService.users$.subscribe(users => {
    this.users = users;
  });
}
onSelectVideo(video: Video): void {
  const videoId = video.id;
  console.log(videoId);
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

onVideoPlay(videoId: number){
  this.videoService.incrementViewCount(videoId).subscribe(response => {
    console.log('Video hochgezählt');

  });
 
}
getUserById(id: number): User | undefined {
  return this.users.find(user => user.id === id);
}

}
