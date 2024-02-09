import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video.class';

@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.scss']
})
export class VideoSearchComponent {
  searchTerm: string = '';
  @Input() videos: Video[] = [];
  @Output() searchResults  = new EventEmitter<Video[]>();
  // filteredVideos: Video[] = [];


  // ngOnInit(): void {
  //   this.filteredVideos = this.videos;
  // }


  onSearchChange(): void {
    const results = this.searchTerm ? this.videos.filter(video =>
      video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      // Weitere Filterkriterien können hier hinzugefügt werden
    ) : this.videos;
    
    this.searchResults.emit(results); // Senden der Suchergebnisse
  }
  
}
