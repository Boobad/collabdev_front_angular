import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // ← nécessaire pour routerLink & routerLinkActive

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLink], // <-- ajoute CommonModule ici
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

