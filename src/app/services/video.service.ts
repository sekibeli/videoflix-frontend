import { Injectable } from '@angular/core';
import { Video } from '../models/video.class';
import { BehaviorSubject, Observable, Subject, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videosSubject = new BehaviorSubject<Video[]>([])
  public videos$ = this.videosSubject.asObservable();
  private myVideosSubject = new BehaviorSubject<Video[]>([])
  public myVideos$ = this.myVideosSubject.asObservable();

  private filteredVideosSubject = new BehaviorSubject<Video[]>([]);
  public filteredVideos$ = this.filteredVideosSubject.asObservable();

  private likeUpdate = new BehaviorSubject<number | null>(null);

  private showVideosButton = new Subject<void>();



  constructor(private http: HttpClient) { }

  getVideos(): void {
    const url = environment.baseUrl + '/videos/';
    this.http.get<Video[]>(url).subscribe(
      videos => {
        this.videosSubject.next(videos);
      },
      error => {
        console.error('Fehler beim Laden der Videos:', error)
      }
    );
  }


  getFilteredVideos(searchTerm: string): Observable<Video[]> {
    return this.videos$.pipe(
      map(videos => videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.category.toLowerCase().includes(searchTerm.toLowerCase())
        // Hier evtl ein Such-Kriterium für den Autor einbauen
      ))
    );
  }


  updateFilteredVideos(videos: Video[]) {
    this.filteredVideosSubject.next(videos);
  }


  get videosToDisplay$(): Observable<Video[]> {
    return this.filteredVideos$.pipe(
      switchMap(filteredVideos => {
        if (filteredVideos.length === 0) {
          return this.videos$;
        }
        return of(filteredVideos);
      })
    );
  }


  resetFilteredVideos() {
    this.filteredVideosSubject.next([]);
  }

  // getMyVideos():void {
  //   const url = environment.baseUrl + '/videos/?myvideos=true';
  //   this.http.get<Video[]>(url).subscribe(
  //     videos => {
  //       this.myVideosSubject.next(videos);
  //     },
  //     error => {
  //       console.error('Fehler beim Laden der Videos:', error)
  //     }
  //   );
  // }

  deleteVideo(id: number) {
    const url = environment.baseUrl + `/videos/${id}`;
    this.http.delete(url).subscribe(
      (response) => {
        console.log('Video gelöscht', response);
        this.getVideos();
      },
      (error) => {
        console.error('Fehler beim Löschen des Videos', error);

      }
    );
  }

  postVideo(videoData: FormData) {
    const url = environment.baseUrl + `/videos/`;
    return this.http.post(url, videoData);
  }

  updateVideo(videoData: FormData, id: number) {
    const url = environment.baseUrl + `/videos/${id}/`;
    return this.http.put(url, videoData);
  }
  getVideobyId(id: number) {
    const url = environment.baseUrl + `/videos/${id}`;
    return this.http.get<Video>(url);
  }


  toggleLike(videoId: number) {
    const url = environment.baseUrl + `/toggle_like/${videoId}`;
    return this.http.post(url, {});
  }


  notifyLikeUpdate(videoId: number) {
    this.likeUpdate.next(videoId);
  }


  getLikeUpdateListener() {
    return this.likeUpdate.asObservable();
  }


  notifyShowButton() {
    this.showVideosButton.next();
  }


  getShowButtonListener() {
    return this.showVideosButton.asObservable();
  }

}
