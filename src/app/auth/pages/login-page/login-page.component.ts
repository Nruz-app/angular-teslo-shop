import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  fb          = inject(FormBuilder);
  authService = inject(AuthService);
  router      = inject(Router);
  hasError    = signal(false);
  isPosting   = signal(false);

  loginForm = this.fb.group({
    email    : ['test1@google.com',[Validators.required,Validators.email]],
    password : ['Abc123',[Validators.required,Validators.minLength(6)]]
  });

  onSubmit() {

    if(this.loginForm.invalid) {

      this.hasError.set(true);

      //2seg quita el mensaje de alert
      setTimeout( () => {
        this.hasError.set(false);
      },2000);
      return;
    }

    const {email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!,password!)
      .subscribe((isAuthenticated) => {

        if(isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
        //2seg quita el mensaje de alert
        setTimeout( () => {
          this.hasError.set(false);
        },2000);
        return;
    });

  }

}
