import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'] // <-- "styleUrls" au pluriel
})
export class Sidebar implements OnInit {
  user: any = null;
  isCollapsed = false;
  private apiUrl = 'http://localhost:8080/api/v1/contributeurs';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- Injection
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const storedUser = JSON.parse(userData);

      if (storedUser.id) {
        this.http.get<any>(`${this.apiUrl}/${storedUser.id}`).subscribe({
          next: (data) => {
            this.user = {
              id: data.id,
              nom: data.nom,
              prenom: data.prenom,
              email: data.email,
              telephone: data.telephone,
              pointExp: data.pointExp,
              totalCoin: data.totalCoin,
              bibliographie: data.bibliographie || 'Aucune biographie',
              avatar: data.photoProfil ? this.getFullImageUrl(data.photoProfil) : null,
              actif: data.actif,
              initiales: this.getInitiales(data.nom, data.prenom)
            };
            this.cdr.detectChanges(); // <-- Force la mise à jour
          },
          error: (err) => {
            console.error('Erreur récupération contributeur :', err);
            this.user = {
              id: storedUser.id,
              nom: storedUser.nom || '',
              prenom: storedUser.prenom || '',
              avatar: null,
              initiales: this.getInitiales(storedUser.nom, storedUser.prenom)
            };
            this.cdr.detectChanges(); // <-- Mise à jour forcée aussi ici
          }
        });
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  getInitiales(nom: string, prenom: string): string {
    const n = nom ? nom[0].toUpperCase() : '';
    const p = prenom ? prenom[0].toUpperCase() : '';
    return n + p;
  }

  private getFullImageUrl(relativePath: string): string {
    return relativePath.startsWith('http')
      ? relativePath
      : `http://localhost:8080${relativePath}`;
  }
}
