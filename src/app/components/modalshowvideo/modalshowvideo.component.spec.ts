import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalshowvideoComponent } from './modalshowvideo.component';

describe('ModalshowvideoComponent', () => {
  let component: ModalshowvideoComponent;
  let fixture: ComponentFixture<ModalshowvideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalshowvideoComponent]
    });
    fixture = TestBed.createComponent(ModalshowvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
