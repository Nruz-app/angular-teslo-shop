import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {

  private readonly activatedRoute = inject(ActivatedRoute);

   currentPage = toSignal(
     this.activatedRoute.queryParamMap.pipe(
       //Transforma el params page
       map((params) => (params.get('page') ? +params.get('page')! : 1)),
       //Valida si es numerico params page, si no es retorna 1
       map((page) => (isNaN(page) ? 1 : page))
     ),{
       initialValue: 1,
     }
   );


}
