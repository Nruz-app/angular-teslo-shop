import {  CanMatchFn, Route, UrlSegment } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

//Valida si tiene el rol de administrador (Admin)
export const IsAdminGuard : CanMatchFn = async (route : Route,segments : UrlSegment[]) =>{
    const authService = inject(AuthService);

    await firstValueFrom(authService.checkStatus());

    return authService.isAdmin();
}
