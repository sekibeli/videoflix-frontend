import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from 'src/app/models/video.class';

@Component({
  selector: 'app-catalog-grid',
  templateUrl: './catalog-grid.component.html',
  styleUrls: ['./catalog-grid.component.scss']
})
export class CatalogGridComponent {
  @Input() videos! : Video[] | null ;

  constructor(private router: Router){}

  viewVideoDetail(videoId: number){
    this.router.navigate(['/home/detail', videoId])
  }
}
