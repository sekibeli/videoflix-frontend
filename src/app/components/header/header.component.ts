import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Video } from 'src/app/models/video.class';
import { AuthService } from 'src/app/services/auth.service';
import { VideoService } from 'src/app/services/video.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbarCollapse') navbarCollapse: ElementRef | undefined;
  searchTermValue: string = '';
  searchTerm = new Subject<string>();
  videos: Video[] = [];
  searchSub!: Subscription;


  constructor(
    public authService: AuthService,
    private router: Router,
    public videoService: VideoService,
    private location: Location) { }


  ngOnInit(): void {
    this.searchVideosSubscription();
  }


  searchVideosSubscription() {
    this.searchSub = this.searchTerm.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm == '') {
        this.router.navigate(['/home/allvideos']);
        return;
      }
      this.videoService.searchVideos(searchTerm);
      this.router.navigate(['/home/search'], { queryParams: { q: searchTerm } });
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
    this.searchSub.unsubscribe();
  }


  async onLogout() {
    try {
      await this.authService.signout();
      localStorage.removeItem('token');
      this.router.navigateByUrl('/login');
    } catch (err) {
    }
  }

  
  closeNavbar() {
    this.navbarCollapse?.nativeElement.classList.remove('show');
  }

}
