

import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Observable } from 'rxjs';

//NOTA : Recuerda importar el interceptos en el archivo


export function authInterceptor(req: HttpRequest<unknown>,next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> {

  const token = inject(AuthService).token();

  /*******************************************************************************
  * * Debido a que el req es inmutable se debe clonar para poder agregar Token
  *********************************************************************************/

  const newRequest = req.clone({
    headers : req.headers.append('Authorization',`Bearer ${token}`)
  });

  return next(newRequest);


}
