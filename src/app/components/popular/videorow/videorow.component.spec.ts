import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideorowComponent } from './videorow.component';

describe('VideorowComponent', () => {
  let component: VideorowComponent;
  let fixture: ComponentFixture<VideorowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideorowComponent]
    });
    fixture = TestBed.createComponent(VideorowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
