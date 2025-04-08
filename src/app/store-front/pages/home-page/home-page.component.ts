import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent,PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  productsService = inject(ProductService);
  paginationService = inject(PaginationService);


  /****************************************************************************************
  * * rxResource : Proporciona una forma reactiva de interactuar con APIs RESTfull. Es una
  * * extensión de $resource, pero utiliza RxJS para manejar las solicitudes HTTP de manera
  * * más flexible y reactiva, permitiendo el uso de observables en lugar de promesas.
  ******************************************************************************************/
  productResource = rxResource({
      request : () => ({ page : this.paginationService.currentPage() - 1 }),
      loader   : ( {request} ) => {
          return this.productsService.getProducts({
            offset : request.page * 9
          });
      }
  });
}
