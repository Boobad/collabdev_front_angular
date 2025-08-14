import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../core/auth-service';

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './profil-user.html',
  styleUrls: ['./profil-user.css']
})
export class ProfilUser implements OnInit, OnDestroy {
  profileImage: string | ArrayBuffer | null = 'assets/images/profil.png';
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
    // Créer input file invisible
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (event) => this.onFileSelected(event));
    document.body.appendChild(this.fileInput);

    // Récupérer ID utilisateur
    this.getUserIdFromStorage();

    // Charger profil si ID dispo
    if (this.userId) {
      this.loadUserProfile();
    }
  }

  ngOnDestroy() {
    if (this.fileInput) {
      document.body.removeChild(this.fileInput);
    }
  }

  private getUserIdFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }

  private loadUserProfile(): void {
    if (!this.userId) return;

    this.authService.getProfileById(this.userId).subscribe({
      next: (data: any) => {
        this.username = data.prenom && data.nom
          ? `${this.capitalize(data.prenom)} ${this.capitalize(data.nom)}`
          : 'Utilisateur';
        this.email = data.email || '';
        this.bio = data.biographie || 'Aucune biographie disponible';
        this.membresDepuis = this.formatDate(data.createdAt) || '';

        // Photo profil (avec fallback)
        if (data.photoProfilUrl) {
          this.profileImage = this.getFullImageUrl(data.photoProfilUrl);
        } else {
          this.profileImage = 'assets/images/profil.png';
        }

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement profil :', err);
        this.profileImage = 'assets/images/profil.png';
      }
    });
  }

  private getFullImageUrl(relativePath: string): string {
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    return `http://localhost:8080${relativePath}`;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.userId) {
      const file = input.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert('La taille maximale du fichier est de 5MB');
        return;
      }

      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        alert('Format d\'image non supporté (JPEG, JPG, PNG, GIF uniquement)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);

      this.authService.uploadProfilePhoto(this.userId, file).subscribe({
        next: (response: any) => {
          console.log('Photo mise à jour', response);
          if (response.photoUrl) {
            this.profileImage = this.getFullImageUrl(response.photoUrl);
          }
        },
        error: (err: any) => {
          console.error('Erreur upload photo', err);
          this.loadUserProfile();
          alert('Échec upload photo');
        }
      });

      if (this.fileInput) {
        this.fileInput.value = '';
      }
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
      alert('Impossible de modifier le profil: ID utilisateur manquant');
    }
  }
}
