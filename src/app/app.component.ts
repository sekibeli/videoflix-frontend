import { Component, OnInit } from '@angular/core';
import { VideoService } from './services/video.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'videoflix-frontend';

constructor(private videoService: VideoService, private userService: UserService){}

  ngOnInit(){
    // this.videoService.getVideos();
    // this.userService.getUserData();
  
  }
}
