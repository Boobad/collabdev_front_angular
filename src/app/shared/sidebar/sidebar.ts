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
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.user.initiales = this.getInitiales(this.user.nom, this.user.prenom);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Fonction pour générer les initiales
  getInitiales(nom: string, prenom: string): string {
    const n = nom ? nom[0].toUpperCase() : '';
    const p = prenom ? prenom[0].toUpperCase() : '';
    return n + p;
  }
}

