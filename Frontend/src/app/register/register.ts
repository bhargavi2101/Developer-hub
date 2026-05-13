import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  @ViewChild('registerForm') registerForm!: NgForm;

  form = {
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  onSubmit() {
    console.log('Form data being submitted:', this.form);
    console.log('Form validation:', this.registerForm?.valid);
    console.log('Form controls:', this.registerForm?.controls);

    if (!this.form.username || !this.form.email || !this.form.password) {
      console.error('Missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    this.authService.register(this.form).subscribe({
      next: (res: any) => {
        console.log('Success:', res);
        alert('Registered successfully');
      },
      error: (err) => {
        console.error('Registration error:', err);
        console.error('Error status:', err.status);
        console.error('Error details:', err.error);
        alert(this.errorHandler.handleAuthError(err));
      }
    });
  }
}
