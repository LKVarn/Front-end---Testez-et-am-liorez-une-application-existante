import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { NewStudent, StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-create-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './createStudent.component.html',
  styleUrl: './createStudent.component.css'
})

export class CreateStudentComponent {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  createStudentForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    section: ['', Validators.required]
  });
  submitted = false;
  errorMessage = '';

  get form() {
    return this.createStudentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.createStudentForm.invalid) {
      this.createStudentForm.markAllAsTouched();
      return;
    }

    const student: NewStudent = this.createStudentForm.getRawValue();
    this.studentService.createStudent(student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/userList']);
        },
        error: (error: unknown) => {
          console.error('Student creation failed:', error);
          this.errorMessage = 'La création de l’étudiant a échoué. Veuillez réessayer.';
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.createStudentForm.reset();
  }
}