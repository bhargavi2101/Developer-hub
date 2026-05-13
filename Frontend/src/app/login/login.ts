import { Component } from '@angular/core';
import { AuthService } from '../auth-service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  form = {
    email: '',
    password: ''
  };
 
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService
  ) {}

  // ✅ onSubmit method (this was missing)
  onSubmit() {
    console.log('Form Data:', this.form);

    this.authService.login(this.form).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);

        // store token
        localStorage.setItem('token', res.token);

        alert('Login successful');

        // Get the return URL from query parameters, default to dashboard
        this.route.queryParams.subscribe(params => {
          const returnUrl = params['returnUrl'] || '/dashboard';
          // ✅ redirect to return URL or dashboard
          this.router.navigate([returnUrl]);
        });
      },
      error: (err: any) => {
        console.log(err);
        alert(this.errorHandler.handleAuthError(err));
      }
    });
  }

}