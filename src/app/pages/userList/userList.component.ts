import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Student, StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userList.component.html',
  styleUrl: './userList.component.css'
})
export class userListComponent implements OnInit {
  students: Student[] = [];
  errorMessage = '';
  private studentService = inject(StudentService);

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error: unknown) => {
        this.errorMessage = 'Impossible de charger la liste des étudiants.';
      }
    });
  }
}
