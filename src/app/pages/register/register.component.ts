import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const registerUser: Register = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      login: this.registerForm.get('login')?.value,
      password: this.registerForm.get('password')?.value
    };
    this.userService.register(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Registration failed:', error);

          if (error.status === 409) {
            this.errorMessage = 'Erreur: ' + error.status + ' - Ce login est déjà utilisé.';
          } else if (error.status === 429) {
            this.errorMessage = 'Erreur: ' + error.status + ' - Trop de requêtes. Veuillez réessayer plus tard.';
          } else if (error.status === 400) {
            this.errorMessage = 'Erreur: ' + error.status + ' - Données invalides. Veuillez vérifier le formulaire.';
          } else if (error.status === 500) {
            this.errorMessage = 'Erreur: ' + error.status + ' - Erreur serveur. Veuillez réessayer plus tard.';
          } 
          else {
            this.errorMessage = 'L’inscription a échoué. Veuillez réessayer.';
          }
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
}
