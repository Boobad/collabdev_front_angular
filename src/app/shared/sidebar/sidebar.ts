import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // ← nécessaire pour routerLink & routerLinkActive
import { AuthService } from '../../core/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLink], // <-- ajoute CommonModule ici
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar implements OnInit {

  user: any = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

