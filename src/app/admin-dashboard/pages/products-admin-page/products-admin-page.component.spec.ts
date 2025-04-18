import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAdminPageComponent } from './products-admin-page.component';

describe('ProductsAdminPageComponent', () => {
  let component: ProductsAdminPageComponent;
  let fixture: ComponentFixture<ProductsAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsAdminPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
