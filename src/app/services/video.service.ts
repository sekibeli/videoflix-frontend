import { Injectable } from '@angular/core';
import { Video } from '../models/video.class';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
private videosSubject = new BehaviorSubject<Video[]>([])
public videos$ = this.videosSubject.asObservable();
  

constructor(private http: HttpClient) { }

  getVideos():void {
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

  deleteVideo(id: number) {
    const url = environment.baseUrl + `/videos/${id}`;
    this.http.delete(url).subscribe(
        (response) => {
            console.log('Video gelöscht', response);
            
        },
        (error) => {
            console.error('Fehler beim Löschen des Videos', error);
          
        }
    );
}



}
