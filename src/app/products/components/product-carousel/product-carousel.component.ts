import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent implements AfterViewInit,OnChanges {

  images = input.required<string[]>();

  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper : Swiper | undefined = undefined;


  /*Se ejecuta una sola vez después de que Angular ha inicializado
   completamente la vista y los elementos hijos del componente.*/
  ngAfterViewInit() : void {
    this.swinperInit();
  }

  /*Se ejecuta cada vez que cambian los valores de los @Input() en el
  componente. Es útil para reaccionar a cambios en las propiedades de entrada*/
  ngOnChanges(changes : SimpleChanges) : void {

      //Valida si es primer cambio de la propiedad images
      if(changes['images'].firstChange) return;

      if(!this.swiper) return;

      this.swiper.destroy(true, true);

      //Desde la referencia de Angular Busca el elemento con la clase
      const paginationDiv : HTMLDivElement =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

      paginationDiv.innerHTML = '';

      setTimeout(() => { this.swinperInit(); },100)


  }

  swinperInit() {

    const element = this.swiperDiv().nativeElement;

    if(!element) return;

      this.swiper = new Swiper(element, {
        // Optional parameters
        direction: 'horizontal',
        loop: true,

        //Modulos
        modules : [
          Navigation,
          Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });


  }

}
