import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number | string;
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

  getStudentById(id: string): Observable<Student> {
    const token = sessionStorage.getItem('token');

    return this.httpClient.get<Student>(`/api/students/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateStudent(id: string, student: NewStudent): Observable<unknown> {
    const token = sessionStorage.getItem('token');

    return this.httpClient.put<unknown>(`/api/modifyStudents/${encodeURIComponent(id)}`, student, {
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
