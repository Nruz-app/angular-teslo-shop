
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { Options } from '@products/interface/options.interface';
import { Gender, Product,ProductsResponse } from '@products/interface/product-response.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';


const baseUrl = environment.baseUrl;

const productDefault: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};



@Injectable({providedIn: 'root'})
export class ProductService {

  private readonly http = inject(HttpClient);

  private readonly productsCache = new Map<string,ProductsResponse>();

  private readonly productCache = new Map<string,Product>();


  getProducts(options : Options) : Observable<ProductsResponse> {

    const {limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`,{
        params : { limit, offset,gender }
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key,resp))
      );

  }

  getProductByIdSlug(idSlug : string) : Observable<Product> {

    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap( (product) => this.productCache.set(idSlug,product)))
  }

  getProductById(id : string) : Observable<Product> {

    //Valid si es creacion o actualizacion de producto
    if(id === 'new') {
        return of(productDefault);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap( (product) => this.productCache.set(id,product)))
  }

  createProduct(productLike : Partial<Product>,fileList? : FileList) : Observable<Product> {

    return this.http
      .post<Product>(`${baseUrl}/products`,productLike)
      .pipe(
        tap((product) => this.updateProductCache(product)));
  }

  /*************************************************************************************
  updateProductOLD(id : string, productLike : Partial<Product>) : Observable<Product> {

    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`,productLike)
      .pipe(
        tap((product) => this.updateProductCache(product))
      );

  }
  ***************************************************************************************/

  updateProduct(
    id : string, productLike : Partial<Product>,fileList?  : FileList) : Observable<Product> {

      const currentImage = productLike.images ?? [];

      return this.uploadFiles(fileList)
        .pipe(
          map((fileName) => ({
            ...productLike,
            images : [...currentImage,...fileName]
          })),
          /*Es un operador que cancela la suscripción al observable
          anterior y cambia a un nuevo observable cada vez que
          recibe un nuevo valor*/
          switchMap((updateProduct) =>
            this.http.patch<Product>(`${baseUrl}/products/${id}`,updateProduct)
          ),
          tap((product) => this.updateProductCache(product))
        );
  }

  updateProductCache(product : Product) {

    const productId = product.id;

    //Setea el Cache desde el Id (directo)
    this.productCache.set(productId, product);

    //Lista o Barre todo los productos (catch)
    this.productsCache.forEach((productsResponse) => {

      /* Busca por el id, si existe devuelve un nuevo elemento actualizado
      caso contrario devuelve el anterior*/
      productsResponse.products = productsResponse.products
        .map((currenProduct) => currenProduct.id === productId ? product : currenProduct);

    });
    console.log('Cache Actualizado');

  }

  //Sube un Listado de Archivo
  uploadFiles(fileList? : FileList) : Observable<string[]> {

    if (!fileList) return of([]);

    //Recorre la lista de archivo y va llamando al UploadFile Para alojarlo
    const uploadObservable = Array.from(fileList)
    .map((file) => this.uploadFile(file));


    /*Ejecuta todos los observables en uploadObservable y devuelve un
    array con sus resultados cuando todos han completado */
    return forkJoin(uploadObservable)
      .pipe(
        tap((fileName) => console.log({fileName}))
      )

  }

  //Sube una Archivo
  uploadFile(file : File) : Observable<string> {

    const formData = new FormData();
    formData.append('file',file);

    return this.http
    .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(
        map(((response) => response.fileName))
      );
  }
}

