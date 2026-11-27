import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NewStudent, Student, StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-create-modify-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modifyStudent.component.html',
  styleUrl: './modifyStudent.component.css'
})

export class ModifyStudentComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  modifyStudentForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    section: ['', Validators.required]
  });
  studentId: string | null = null;
  submitted = false;
  errorMessage = '';

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (!this.studentId) {
      this.errorMessage = 'Identifiant de l’étudiant manquant.';
      return;
    }

    this.studentService.getStudentById(this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student: Student) => {
          this.modifyStudentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            section: student.section
          });
        },
        error: (error: unknown) => {
          console.error('Student loading failed:', error);
          this.errorMessage = 'Impossible de charger les informations de cet étudiant.';
        }
      });
  }

  get form() {
    return this.modifyStudentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.modifyStudentForm.invalid) {
      this.modifyStudentForm.markAllAsTouched();
      return;
    }

    if (!this.studentId) {
      this.errorMessage = 'Identifiant de l’étudiant manquant.';
      return;
    }

    const student: NewStudent = this.modifyStudentForm.getRawValue();
    this.studentService.updateStudent(this.studentId, student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/userList']);
        },
        error: (error: unknown) => {
          console.error('Student update failed:', error);
          this.errorMessage = 'La modification de l’étudiant a échoué. Veuillez réessayer.';
        }
      });
  }

  onCancel(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.router.navigate(['/dashboard/userList']);
  }
}