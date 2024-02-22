import { Component, Input } from '@angular/core';
import { Video } from 'src/app/models/video.class';

@Component({
  selector: 'app-catalog-grid',
  templateUrl: './catalog-grid.component.html',
  styleUrls: ['./catalog-grid.component.scss']
})
export class CatalogGridComponent {
  @Input() videos! : Video[] | null ;
}
