
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../core/models/Login';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );

  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      alert("User not found in database. Please check your login and password.");
      return;
    }
    const loginUser: Login = {
      login: this.loginForm.get("login")?.value,
      password: this.loginForm.get('password')?.value
    };
    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (token: string) => {
          // garde le username & le token pour le faire apparaitre dans le dashboard
          sessionStorage.setItem('username', loginUser.login);
          sessionStorage.setItem('token', token);

          // swith to dashboard page
          this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          console.error('Login request failed:', error);
          alert('Login failed. Check your credentials and that the backend is running.');
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

}
