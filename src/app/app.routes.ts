import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path : 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    //Uso de Guards
    canMatch : [
      //() => { console.log('Hola Mundo desde Guard'); return true; }
      NotAuthenticatedGuard
    ]
  },
  {
    path : 'admin',
    loadChildren : () => import('./admin-dashboard/admin-sashboard.routes')
  },
  {
    path : '',
    loadChildren: () => import('./store-front/store-front.routes')
  }
];
