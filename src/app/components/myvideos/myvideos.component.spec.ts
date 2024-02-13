import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyvideosComponent } from './myvideos.component';

describe('MyvideosComponent', () => {
  let component: MyvideosComponent;
  let fixture: ComponentFixture<MyvideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyvideosComponent]
    });
    fixture = TestBed.createComponent(MyvideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
