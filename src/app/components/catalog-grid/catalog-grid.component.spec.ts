import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGridComponent } from './catalog-grid.component';

describe('CatalogGridComponent', () => {
  let component: CatalogGridComponent;
  let fixture: ComponentFixture<CatalogGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogGridComponent]
    });
    fixture = TestBed.createComponent(CatalogGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
