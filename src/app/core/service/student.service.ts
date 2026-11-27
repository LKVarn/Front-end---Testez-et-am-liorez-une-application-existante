import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  firstName: string;
  lastName: string;
  section: string;
  firstVisit: Date;
}

export type NewStudent = Pick<Student, 'firstName' | 'lastName' | 'section'>;

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) { }

  createStudent(student: NewStudent): Observable<unknown> {
    const token = sessionStorage.getItem('token');

    return this.httpClient.post<unknown>('/api/createStudent', student, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getStudents(): Observable<Student[]> {
    const token = sessionStorage.getItem('token');

    return this.httpClient.get<Student[]>('/api/students', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
