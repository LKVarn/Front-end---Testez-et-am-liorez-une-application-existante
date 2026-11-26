import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  ngOnInit(): void {
  }

  //récupère le username et le token pour les afficher dans le dashboard
  username = sessionStorage.getItem('username') ?? '';
token = sessionStorage.getItem('token') ?? '';

}