import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth-service';

@Component({
  selector: 'app-form-suscribe',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink],
  templateUrl: './form-suscribe.html',
  styleUrl: './form-suscribe.css'
})
export class FormSuscribe {
  showModals = false;
  isLoading: boolean = false;
  showPassword = false;
  showConfirmPassword = false;
  termsAccepted = false;
  
  // Messages d'erreur/succès
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Erreurs par champ
  errors: any = {
    nom: null,
    prenom: null,
    telephone: null,
    email: null,
    password: null,
    confirmPassword: null,
    terms: null
  };

  // Validation du mot de passe en temps réel
  get passwordHasMinLength(): boolean {
    return this.user.password?.length >= 8;
  }

  get passwordHasUpperCase(): boolean {
    return /[A-Z]/.test(this.user.password);
  }

  get passwordHasNumber(): boolean {
    return /[0-9]/.test(this.user.password);
  }

  get passwordHasSpecialChar(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.user.password);
  }

  // Form model
  user = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleModal() {
    this.showModals = !this.showModals;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  clearErrors() {
    this.errorMessage = null;
    this.successMessage = null;
    this.errors = {
      nom: null,
      prenom: null,
      telephone: null,
      email: null,
      password: null,
      confirmPassword: null,
      terms: null
    };
  }

  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    // Validation des champs requis
    if (!this.user.nom) {
      this.errors.nom = 'Le nom est obligatoire';
      isValid = false;
    }

    if (!this.user.prenom) {
      this.errors.prenom = 'Le prénom est obligatoire';
      isValid = false;
    }

    if (!this.user.telephone) {
      this.errors.telephone = 'Le téléphone est obligatoire';
      isValid = false;
    } else if (!/^[0-9]{8}$/.test(this.user.telephone)) {
      this.errors.telephone = 'Le numéro de téléphone doit contenir 10 chiffres';
      isValid = false;
    }

    if (!this.user.email) {
      this.errors.email = 'L\'email est obligatoire';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      this.errors.email = 'Veuillez entrer un email valide';
      isValid = false;
    }

    if (!this.user.password) {
      this.errors.password = 'Le mot de passe est obligatoire';
      isValid = false;
    } else if (!this.validatePassword(this.user.password)) {
      this.errors.password = 'Le mot de passe ne respecte pas les exigences de sécurité';
      isValid = false;
    }

    if (!this.user.confirmPassword) {
      this.errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (this.user.password !== this.user.confirmPassword) {
      this.errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    if (!this.termsAccepted) {
      this.errors.terms = 'Vous devez accepter les conditions d\'utilisation';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (!this.validateForm()) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;

    const registrationData = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      telephone: this.user.telephone,
      email: this.user.email,
      password: this.user.password
    };

    this.authService.registerUser(registrationData).subscribe({
      next: (response) => {
        this.successMessage = 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        this.isLoading = false;
        
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur serveur - veuillez réessayer plus tard';
        } else if (err.status === 400) {
          this.errorMessage = 'Données invalides - vérifiez les informations saisies';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  }
}