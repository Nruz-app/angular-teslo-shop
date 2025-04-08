import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from '@products/components/product-details/product-details.component';
import { ProductService } from '@products/services/product.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
  styleUrl: './product-admin-page.component.css'
})
export class ProductAdminPageComponent {

  //Se para tomar la Ruta Activa
  activatedRoute = inject(ActivatedRoute);
  //Se Usa para una Redirecion
  router = inject(Router);

  productService = inject(ProductService);


  productId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );


  productResource = rxResource({
    request: () => ({ id : this.productId() }),
    loader : ({ request}) => {
      return this.productService.getProductById(request.id);
    }
  })

  redirectEffect = effect( () => {

    if (this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }

  })
}
