import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from 'src/app/models/video.class';

@Component({
  selector: 'app-my-catalog-list',
  templateUrl: './my-catalog-list.component.html',
  styleUrls: ['./my-catalog-list.component.scss']
})
export class MyCatalogListComponent {
  @Input() videos! : Video[] | null ;

  constructor(private router: Router){}

  editVideoDetail(videoId: number){
    this.router.navigate(['/home/edit-video', videoId])
  }
}
