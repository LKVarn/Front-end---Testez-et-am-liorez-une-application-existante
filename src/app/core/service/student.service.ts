import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  firstName: string;
  lastName: string;
  section: string;
  firstVisit: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]> {
    const token = sessionStorage.getItem('token');

    return this.httpClient.get<Student[]>('/api/students', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
