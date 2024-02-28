import { Component, Input } from '@angular/core';
import { Video } from 'src/app/models/video.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent {
  @Input() videos! : Video[] | null ;

  constructor(private router: Router){}

  viewVideoDetail(videoId: number){
    this.router.navigate(['/home/detail', videoId])
  }
}
