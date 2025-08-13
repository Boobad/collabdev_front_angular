import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParticipationRequest, ParticipationService } from '../../../../core/participation.service';

@Component({
  selector: 'app-formulaire-participation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './formulaire-participation.html',
  styleUrls: ['./formulaire-participation.css'],
})
export class FormulaireParticipation implements OnInit {
  formData = {
    fullname: '',
    email: '',
    portfolio: '',
    role: '',
    motivation: '',
    experience: '',
  };

   duplicateError: boolean = false;  // flag pour message erreur "déjà envoyé"
  errorMessage: string = ''; 

  motivationMessage = '200 caractères restants (min. 200)';
  idProjet!: number;
  idContributeur!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const projetIdStr = this.route.snapshot.paramMap.get('idProjet');
    if (!projetIdStr) {
      alert('Aucun ID de projet reçu. Retour à la liste des projets.');

      return;
    }
    this.idProjet = +projetIdStr;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Utilisateur non connecté');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.id) {
        alert('ID utilisateur introuvable');
        this.router.navigate(['/login']);
        return;
      }
      this.idContributeur = user.id;
    } catch {
      alert('Erreur lors de la récupération des données utilisateur');
      this.router.navigate(['/login']);
      return;
    }
  }

  selectRole(role: string) {
    this.formData.role = role;
    this.cdRef.detectChanges();
  }

  updateMotivationCount() {
    const count = this.formData.motivation.length;
    const min = 200;
    if (count < min) {
      this.motivationMessage = `${min - count} caractères restants (min. ${min})`;
    } else {
      this.motivationMessage = 'Motivation suffisante';
    }
    this.cdRef.detectChanges();
  }

  mapRoleToProfil(role: string): string {
    switch (role.toLowerCase()) {
      case 'developer': return 'DEVELOPPEUR';
      case 'designer': return 'DESIGNER';
      case 'manager': return 'GESTIONNAIRE';
      default: return 'DEVELOPPEUR';
    }
  }

onSubmit() {
  // validations existantes
  if (!this.formData.role) {
    alert('Veuillez sélectionner un rôle');
    return;
  }

  if (this.formData.motivation.length < 200) {
    alert('Veuillez décrire vos motivations en au moins 200 caractères');
    return;
  }

  const participation: ParticipationRequest = {
    id: 0,
    profil: this.mapRoleToProfil(this.formData.role),
    statut: 'EN_ATTENTE',
    scoreQuiz: '',
    estDebloque: true,
    datePostulation: new Date().toISOString().split('T')[0],
    commentaireMotivation: this.formData.motivation,
    commentaireExperience: this.formData.experience,
    projetId: this.idProjet,
    contributeurId: this.idContributeur,
  };

  this.participationService
    .envoyerParticipation(this.idProjet, this.idContributeur, participation)
    .subscribe({
      next: () => {
        this.router.navigate(['/demarrage-quiz'], {
          queryParams: { role: this.formData.role, email: this.formData.email },
        });
      },
      error: (err) => {
        console.error('Erreur lors de l’envoi', err);
        // Si le message d’erreur correspond à "déjà envoyé"
        if (
          err.error?.message?.includes(
            'Le contributeur a déjà envoyé une demande pour ce projet'
          )
        ) {
          this.errorMessage = 'Vous avez déjà postulé à ce projet.';
          this.duplicateError = true;  // affiche modal
          this.cdRef.detectChanges();
        } else {
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      },
    });
}

}
