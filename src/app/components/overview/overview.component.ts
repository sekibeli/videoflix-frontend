import { Component, OnDestroy, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video.class';
import { VideoService } from 'src/app/services/video.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.class';


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



  constructor(private videoService: VideoService, private userService: UserService) { }

  ngOnInit() {
    this.videoService.getVideos();
    this.userService.getUserData();
    this.subscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });
    this.videoService.videos$.subscribe(videos => {
      this.groupVideosByCategory(videos);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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
    this.selectedVideo = video;
    console.log(this.selectedVideo);
  }

  deleteSelectedVideo() {
    this.selectedVideo = null;
  }

  onModalClose() {
    this.selectedVideo = null;
  }

  deleteVideo(videoId: number) {
    console.log('delete', videoId);
    this.videoService.deleteVideo(videoId);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

}
