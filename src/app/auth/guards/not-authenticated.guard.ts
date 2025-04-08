import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { firstValueFrom } from "rxjs";


//Valida que NO entra al login, si ya tiene TOKEN
export const NotAuthenticatedGuard : CanMatchFn = async (route : Route,segments : UrlSegment[]) =>{

  const authService = inject(AuthService);
  const router      = inject(Router);

  //firstValueFrom : Permite enviar un Observable y espera la respuesta como una Promise
  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if(isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;

}
