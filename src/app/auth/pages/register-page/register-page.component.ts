import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  fb          = inject(FormBuilder);
  authService = inject(AuthService);
  router      = inject(Router);

  registerForm = this.fb.group({
    fullName : ['',[Validators.required]],
    email    : ['',[Validators.required,Validators.email]],
    password : ['',[Validators.required,Validators.minLength(6)]]
  });

  onSubmit() {

    const {fullName = '',email = '', password = '' } = this.registerForm.value;

    this.authService.register(fullName!,email!,password!)
      .subscribe((isAuthenticated) => {

        if(isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        return;
    });

  }

}
