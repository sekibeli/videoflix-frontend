import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCatalogListComponent } from './my-catalog-list.component';

describe('MyCatalogListComponent', () => {
  let component: MyCatalogListComponent;
  let fixture: ComponentFixture<MyCatalogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCatalogListComponent]
    });
    fixture = TestBed.createComponent(MyCatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
