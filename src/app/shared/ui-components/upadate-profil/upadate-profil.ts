import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-upadate-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upadate-profil.html',
  styleUrls: ['./upadate-profil.css']
})
export class UpadateProfil implements OnInit {
  profileData: any = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '' // Ajout du champ de confirmation
  };

  userId: number | null = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Ajout pour détecter les changements
  isFormDirty: boolean = false;
  originalData: any = {};

  // États de validation
  passwordError: string | null = null;
  isPasswordValid: boolean = true;
  passwordStrength: number = 0;

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis les paramètres de route
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.userId) {
      this.loadProfileData();
    } else {
      this.errorMessage = 'ID utilisateur non spécifié';
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:8080/api/v1/contributeurs/${this.userId}`)
      .pipe(
        tap(response => {
          this.profileData = {...response, password: '', confirmPassword: ''};
          this.originalData = {...response};
          this.isLoading = false;
          this.cdRef.detectChanges();
        }),
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors du chargement du profil';
          console.error('API Error:', error);
          this.cdRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }

  // Détection des changements dans le formulaire
  onInputChange(): void {
    // Vérifier si des modifications ont été apportées
    const hasChanges = Object.keys(this.profileData).some(key => {
      if (key === 'password' || key === 'confirmPassword') {
        return this.profileData[key] !== '';
      }
      return this.profileData[key] !== this.originalData[key];
    });
    
    this.isFormDirty = hasChanges;
    
    // Vérifier la force du mot de passe
    if (this.profileData.password) {
      this.checkPasswordStrength();
    }
    
    // Vérifier la correspondance des mots de passe
    this.validatePasswordMatch();
    
    this.cdRef.detectChanges();
  }

  validatePasswordMatch(): void {
    if (this.profileData.password && this.profileData.confirmPassword) {
      this.isPasswordValid = this.profileData.password === this.profileData.confirmPassword;
      this.passwordError = this.isPasswordValid ? null : 'Les mots de passe ne correspondent pas';
    } else {
      this.isPasswordValid = true;
      this.passwordError = null;
    }
  }

  checkPasswordStrength(): void {
    const password = this.profileData.password;
    let strength = 0;
    
    // Longueur minimale
    if (password.length >= 8) strength += 25;
    
    // Contient des lettres minuscules et majuscules
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    
    // Contient des chiffres
    if (/\d/.test(password)) strength += 25;
    
    // Contient des caractères spéciaux
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    this.passwordStrength = strength;
  }

  getPasswordStrengthClass(): string {
    if (this.passwordStrength < 50) return 'weak';
    if (this.passwordStrength < 75) return 'medium';
    return 'strong';
  }

  goBack(): void {
    if (this.isFormDirty) {
      const confirmLeave = confirm('Vous avez des modifications non enregistrées. Quitter sans sauvegarder?');
      if (!confirmLeave) return;
    }
    this.location.back();
  }

  saveProfile(): void {
    // Valider avant soumission
    this.validatePasswordMatch();
    
    if (!this.isPasswordValid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdRef.detectChanges();

    // Préparer les données pour l'API
    const dataToSend = {...this.profileData};
    
    // Si le mot de passe est vide, ne pas l'envoyer
    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    delete dataToSend.confirmPassword;

    this.http.put(`http://localhost:8080/api/v1/contributeurs/${this.userId}`, dataToSend)
      .pipe(
        tap(() => {
          this.isSaving = false;
          this.successMessage = 'Profil mis à jour avec succès!';
          this.originalData = {...this.profileData};
          this.isFormDirty = false;
          
          this.cdRef.detectChanges();
          
          // Effacer le message après 3 secondes
          setTimeout(() => {
            this.successMessage = null;
            this.cdRef.detectChanges();
          }, 3000);
        }),
        catchError(error => {
          this.isSaving = false;
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
          console.error('API Error:', error);
          this.cdRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
    this.cdRef.detectChanges();
  }
}