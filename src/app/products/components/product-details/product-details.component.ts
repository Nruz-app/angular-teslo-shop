import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarouselComponent } from '../product-carousel/product-carousel.component';
import { Product } from '@products/interface/product-response.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { ProductService } from '@products/services/product.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent,ReactiveFormsModule,FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();
  router = inject(Router);

  productService = inject(ProductService);
  sizes   = ['SX','S','M','L','XL'];

  fb = inject(FormBuilder);

  wasSaved = signal(false);

  tempFile = signal<string[]>([]);
  fileList = signal<FileList | undefined>(undefined);


  fileToCarousel = computed( () => {
    //Retorna una nueva lista de imágenes combinando las del producto con las imágenes
    return [...this.product().images,...this.tempFile()];
  })

  //Initial y Value Formulario
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  ngOnInit() : void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike : Partial<Product>) {
    this.productForm.reset(this.product() as any);
    //this.productForm.patchValue(formLike as any);

    //Join une los valores del arreglo por ","
    this.productForm.patchValue({ tags : formLike.tags?.join(',') });
  }

  onSizeClicked(size : string) {

    const currentSizes = this.productForm.value.sizes ?? [];

    if(currentSizes.includes(size)) {
        currentSizes.splice(currentSizes.indexOf(size),1);
    }
    else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes : currentSizes });

  }

  async onSubmit() {

    //console.log('form',this.productForm.value);
    const isValid = this.productForm.valid;

    this.productForm.markAllAsTouched();

    if (! isValid) return;

    const formValue = this.productForm.value;

    const productLike : Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
        ?.toLowerCase().split(',')
        .map((tag) => tag.trim() ?? [])
    }

    //Create Product
    if(this.product().id === 'new') {

      const product = await firstValueFrom(
        this.productService.createProduct(productLike,this.fileList())
      );

      this.router.navigate(['/admin/products',product.id]);

    }
    //Update Product
    else {
        await firstValueFrom(
          this.productService.updateProduct(
            this.product().id,
            productLike,
            this.fileList()
          )
        );
    }

    //Habilita el Mensaje
    this.wasSaved.set(true);

    //Despues de 2s se quita el mensaje
    setTimeout( () => {this.wasSaved.set(false)},2000);

  }

  onFileChangerd(event : Event) {

    const fileList = (event.target as HTMLInputElement).files;
    this.fileList.set(fileList ?? undefined);
    this.tempFile.set([]);

    const fileUrls = Array.from(fileList ?? [])
      .map((file) => URL.createObjectURL(file) );

    this.tempFile.set(fileUrls);

  }

}
