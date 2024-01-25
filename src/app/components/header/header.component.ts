import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchTerm: string = '';
  private videoSubscription?: Subscription;
  searchResults: Video[] = [];


  constructor(
    public authService: AuthService,
    private router: Router,
    private videoService: VideoService) { }


  searchVideos() {
    if (!this.searchTerm) {
      this.searchResults = [];
      return;
    }
    this.videoService.getFilteredVideos(this.searchTerm).subscribe(videos => {
      this.searchResults = videos;
    });
  }


  onSelectVideo(video: Video) {
    this.videoService.updateFilteredVideos(this.searchResults);
    this.searchTerm = '';
  }


  async onLogout() {
    try {
      await this.authService.signout();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
    }
  }

}
