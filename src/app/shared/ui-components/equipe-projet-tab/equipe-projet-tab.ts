import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- import ajouté
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Participant, ParticipantsService } from '../../../core/services/participants.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipe-projet-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipe-projet-tab.html',
  styleUrls: ['./equipe-projet-tab.css']
})
export class EquipeProjetTab implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  user: any = null;
  projectId: number = 0;
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private participantsService: ParticipantsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef  // <-- injection ici
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadProjectId();
  }

  private loadProjectId(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.projectId = +params['id'] || 0;
        if (this.projectId) {
          this.loadParticipants();
        } else {
          this.errorMessage = 'ID de projet non valide';
          this.isLoading = false;
          this.cdr.detectChanges();  // <-- update de la vue
        }
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération du projet';
        this.isLoading = false;
        console.error(err);
        this.cdr.detectChanges();  // <-- update de la vue
      }
    });
  }

  private loadUserData(): void {
    try {
      const userData = localStorage.getItem('user');
      this.user = userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Erreur de parsing des données utilisateur', e);
    }
  }

 loadParticipants(): void {
  this.isLoading = true;
  this.errorMessage = null;
  
  this.participantsService.getParticipantsByProject(this.projectId).subscribe({
    next: (data) => {
      // Filtrer uniquement les participants acceptés
      const acceptedParticipants = Array.isArray(data) 
        ? data.filter(p => p.statut?.toLowerCase() === 'accepte' || p.statut?.toLowerCase() === 'actif') 
        : [];

      this.participants = acceptedParticipants;
      this.filteredParticipants = [...this.participants];
      this.isLoading = false;
      this.cdr.detectChanges();  // mise à jour forcée après réception des données
    },
    error: (err) => {
      this.errorMessage = 'Erreur lors du chargement des participants';
      this.isLoading = false;
      console.error(err);
      this.cdr.detectChanges();  // mise à jour forcée en cas d'erreur
    }
  });
}


  filterParticipants(): void {
    if (!this.searchTerm.trim()) {
      this.filteredParticipants = [...this.participants];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredParticipants = this.participants.filter(p => 
      (p.contributeurPrenom?.toLowerCase().includes(term)) ||
      (p.contributeurNom?.toLowerCase().includes(term)) ||
      (p.contributeurEmail?.toLowerCase().includes(term)) ||
      (p.profil?.toLowerCase().includes(term))
    );
  }

  getAvatarUrl(participant: Participant): string {
    const firstName = participant.contributeurPrenom || '';
    const lastName = participant.contributeurNom || '';
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=64`;
  }

  getStatusClass(status?: string): string {
    if (!status) return 'status-default';
    
    switch (status.toLowerCase()) {
      case 'actif': return 'status-active';
      case 'inactif': return 'status-inactive';
      case 'en attente': return 'status-pending';
      default: return 'status-default';
    }
  }

  getActiveParticipantsCount(): number {
    return this.participants.filter(p => p.statut?.toLowerCase() === 'actif').length;
  }

  getAverageQuizScore(): string {
    const validScores = this.participants
      .filter(p => typeof p.scoreQuiz === 'number')
      .map(p => Number(p.scoreQuiz));
    
    if (validScores.length === 0) return 'N/A';
    
    const average = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    return average.toFixed(1);
  }

  getTaskCount(participant: Participant): number {
    return (participant as any)?.nombreTaches || 0;
  }
}
