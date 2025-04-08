import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

//NOTA : Recuerda importar el interceptos en el archivo


export function loggingInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'Interceptor - Retorna una respuesta con el estado', event.status);
      }
    })
  );

}
