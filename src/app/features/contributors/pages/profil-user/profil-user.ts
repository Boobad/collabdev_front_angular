import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../core/auth-service';

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [RouterLink, HttpClientModule],
  templateUrl: './profil-user.html',
  styleUrls: ['./profil-user.css']
})
export class ProfilUser implements OnInit, OnDestroy {
  profileImage: string | ArrayBuffer | null = 'profil.png';
  fileInput: HTMLInputElement | null = null;
  userId: number | null = null;

  // Données profil
  username: string = '';
  email: string = '';
  bio: string = '';
  membresDepuis: string = '';

  constructor(
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialisation input file
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (event) => this.onFileSelected(event));
    document.body.appendChild(this.fileInput);

    // Récupérer l'objet utilisateur depuis localStorage et extraire l'id
    const userStr = localStorage.getItem('user');
    let userId: number = NaN;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
        this.userId = userId;
      } catch (e) {
        console.error('Erreur lors du parsing de user:', e);
      }
    }

    if (!isNaN(userId)) {
      this.authService.getProfileById(userId).subscribe({
        next: (data: any) => {
          this.username = data.prenom && data.nom
            ? `${this.capitalize(data.prenom)} ${this.capitalize(data.nom)}`
            : 'Utilisateur';
          this.email = data.email || '';
          this.bio = '';           // À compléter si dispo dans API
          this.membresDepuis = '';  // À compléter si dispo dans API
          this.profileImage = 'profil.png'; // À remplacer si API fournit une image
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement profil :', err);
        }
      });
    } else {
      console.error('User ID invalide:', userStr);
    }
  }

  ngOnDestroy() {
    if (this.fileInput) {
      document.body.removeChild(this.fileInput);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
        this.cdRef.detectChanges();
        if (this.fileInput) {
          this.fileInput.value = '';
        }
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  navigateToUpdate(): void {
    if (this.userId) {
      this.router.navigate(['/update-profil', this.userId]);
    } else {
      console.error('User ID non disponible');
      // Option: afficher un message d'erreur à l'utilisateur
    }
  }
}