import { Component, Input } from '@angular/core';
import { Video } from 'src/app/models/video.class';

@Component({
  selector: 'app-videorow',
  templateUrl: './videorow.component.html',
  styleUrls: ['./videorow.component.scss']
})
export class VideorowComponent {
@Input() videos! : Video[] | null ;
}
