import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly _authStatus = signal<AuthStatus>('checking');
  private readonly _user       = signal<User | null>(null);
  private readonly _token      = signal<string | null>(localStorage.getItem('token'));

  private readonly http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {

    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()) return 'authenticated';

    return 'not-authenticated';

  });

  user    = computed(() => this._user());
  token   = computed(this._token);
  isAdmin = computed( ()=> this._user()?.roles.includes('admin') ?? false);

  //Se ejecuta cuando se carga el componente
  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });


  login(email : string,password : string) : Observable<boolean> {

    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`,
      { email ,password })
      .pipe(
        map((response) =>  this.handleAuthSuccess(response)),
        catchError(( error : any ) => this.handleAuthError(error))
      );
  }

  register(fullName : string,email : string,password : string) : Observable<boolean> {

    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`,
      { fullName,email ,password })
      .pipe(
        map((response) =>  this.handleAuthSuccess(response)),
        catchError(( error : any ) => this.handleAuthError(error))
      );
  }


  checkStatus() : Observable<boolean> {

    const token = localStorage.getItem('token');

    if(!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`)
    .pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError(( error : any ) => this.handleAuthError(error))
    )
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ user , token} : AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    //Save Storage
    localStorage.setItem('token',token);
    return true;
  }

  private handleAuthError(error : any) {
    console.log('Error Response',error);
    this.logout();
    return of(false);
  }

}
