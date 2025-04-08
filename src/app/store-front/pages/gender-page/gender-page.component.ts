import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent,PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css'
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductService);
  paginationService = inject(PaginationService);

  /****************************************************************************************
  * * - Escucha cambios en los parámetros de la URL.
  * * - map(({ gender }) => gender) extrae el parámetro gender.
  * * - toSignal(...) convierte el observable en una signal reactiva, lo que permite que
  * * los cambios sean automáticamente detectados en la plantilla.
  *****************************************************************************************/
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender )));



  /****************************************************************************************
  * * rxResource : Proporciona una forma reactiva de interactuar con APIs RESTfull. Es una
  * * extensión de $resource, pero utiliza RxJS para manejar las solicitudes HTTP de manera
  * * más flexible y reactiva, permitiendo el uso de observables en lugar de promesas.
  ******************************************************************************************/
  productsResource = rxResource({
    request : () => ({
      gender : this.gender(),
      page : this.paginationService.currentPage() - 1
    }),
    loader   : ( {request} ) => {
        return this.productsService.getProducts({
          gender : request.gender,
          offset : request.page * 9
        });
    }
  });

}
