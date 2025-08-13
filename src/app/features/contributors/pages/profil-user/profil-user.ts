import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../core/auth-service';
import { Observable } from 'rxjs'; // Import manquant pour Observable

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
    // Initialisation input file
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', (event) => this.onFileSelected(event));
    document.body.appendChild(this.fileInput);

    // Récupérer l'ID utilisateur
    this.getUserIdFromStorage();
    
    // Charger le profil
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
        console.error('Erreur lors du parsing de user:', e);
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
        
        // Utiliser l'URL complète de l'image
        if (data.photoProfilUrl) {
          this.profileImage = this.getFullImageUrl(data.photoProfilUrl);
        } else {
          this.profileImage = 'assets/images/profil.png';
        }
        
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement profil :', err);
      }
    });
  }

  private getFullImageUrl(relativePath: string): string {
    // Ajouter le domaine de base si nécessaire
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
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille maximale du fichier est de 5MB');
        return;
      }
      
      // Vérifier le type MIME
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        alert('Format d\'image non supporté (JPEG, JPG, PNG, GIF uniquement)');
        return;
      }

      const reader = new FileReader();

      // Preview immédiate
      reader.onload = (e) => {
        this.profileImage = e.target?.result || null;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);

      // Upload vers le serveur
      this.authService.uploadProfilePhoto(this.userId, file).subscribe({
        next: (response: any) => {
          console.log('Photo mise à jour avec succès', response);
          // Mettre à jour avec la nouvelle URL de l'API
          if (response.photoUrl) {
            this.profileImage = this.getFullImageUrl(response.photoUrl);
          }
        },
        error: (err: any) => {
          console.error('Erreur upload photo', err);
          // Recharger l'ancienne image en cas d'erreur
          this.loadUserProfile();
          alert('Échec de l\'upload de la photo');
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
