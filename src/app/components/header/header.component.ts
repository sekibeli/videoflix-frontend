import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchTermValue: string = '';
  searchTerm = new Subject<string>();
  videos: Video[] = [];
  searchSubscription!: Subscription;


  constructor(
    public authService: AuthService,
    private router: Router,
    public videoService: VideoService) { }


  ngOnInit(): void {
    this.searchVideosSubscription();
  }


  searchVideosSubscription() {
    this.searchSubscription = this.searchTerm.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.videoService.searchVideos(searchTerm); 
      console.log(this.searchTermValue);      
    });
  }


  clearSearch(): void {
    this.searchTermValue = ''; 
    this.search('');
  }  


  search(term: string): void {
    this.searchTerm.next(term);
  }


  onInputChange(term: string): void {
    if (term === '') {
      this.clearSearch();
    } else {
      this.searchTerm.next(term);
    }
  }
  

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
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
