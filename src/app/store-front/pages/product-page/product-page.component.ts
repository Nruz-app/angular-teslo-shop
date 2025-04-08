import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductService } from '@products/services/product.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {

  activatedRoute  = inject(ActivatedRoute);
  productsService = inject(ProductService);

  /*****************************************************************************************
  * * - snapshot obtiene los parámetros de la URL en un solo momento.
  * * - No se actualiza automáticamente si la URL cambia después de que el componente ya
  * * se ha renderizado.
  * * - Se usa cuando no necesitas estar pendiente de cambios dinámicos en la URL
  ******************************************************************************************/
  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  /****************************************************************************************
  * * rxResource : Proporciona una forma reactiva de interactuar con APIs RESTfull. Es una
  * * extensión de $resource, pero utiliza RxJS para manejar las solicitudes HTTP de manera
  * * más flexible y reactiva, permitiendo el uso de observables en lugar de promesas.
  ******************************************************************************************/
  productResource = rxResource({
    request : () => ({ idSlug : this.productIdSlug }),
    loader   : ( {request} ) => {
        return this.productsService.getProductByIdSlug(request.idSlug);
    }
  });

}
