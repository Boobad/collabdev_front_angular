import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Participant, ParticipantsService } from '../../../core/services/participants.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipes-details-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipes-details-tab.html',
  styleUrls: ['./equipes-details-tab.css']
})
export class EquipesDetailsTab implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  connectedParticipantId: number | null = null;
  user: any = null;
  projectId: number = 0;
  
  recentActivities = [
    {
      user: { name: "Jean Dupont", email: "jean.dupont@example.com" },
      action: "a terminé le quiz avec un score de 85%",
      time: "Il y a 2 heures"
    },
    {
      user: { name: "Marie Martin", email: "marie.martin@example.com" },
      action: "a débloqué un nouveau niveau",
      time: "Il y a 5 heures"
    },
    {
      user: { name: "Pierre Lambert", email: "pierre.lambert@example.com" },
      action: "a rejoint le projet",
      time: "Hier"
    }
  ];

  constructor(
    private participantsService: ParticipantsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadProjectId();
  }

  private loadProjectId(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'] || 0;
      if (this.projectId) {
        console.log('📌 projectId récupéré :', this.projectId);
        this.loadParticipants();
      } else {
        console.warn('⚠️ Aucun projectId trouvé dans l\'URL.');
      }
    });
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        console.log('👤 Utilisateur connecté:', this.user);
      } catch (e) {
        console.error('❌ Erreur parsing user data:', e);
      }
    }
  }

  loadParticipants(): void {
    console.log(`📡 Chargement des participants pour le projet ID=${this.projectId}...`);

    this.participantsService.getParticipantsByProject(this.projectId).subscribe({
      next: (data) => {
        console.log('✅ Participants reçus:', data);
        this.participants = data;
        this.filteredParticipants = [...this.participants];

        const participant = data.find(p => p.contributeurEmail === this.user?.email);
        if (participant) {
          this.connectedParticipantId = participant.id;
          console.log('🔑 ID du participant connecté:', this.connectedParticipantId);
        } else {
          console.warn('⚠️ L\'utilisateur connecté ne fait pas partie de ce projet.');
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des participants:', err);
      },
      complete: () => {
        console.log('✔️ Chargement des participants terminé');
      }
    });
  }

  getActiveParticipantsCount(): number {
    return this.participants.filter(p => p.statut === 'actif').length;
  }

  getAverageQuizScore(): string {
  const scores = this.participants
    .filter(p => p.scoreQuiz !== null && p.scoreQuiz !== undefined)
    .map(p => Number(p.scoreQuiz)); // Conversion explicite en nombre
  
  if (scores.length === 0) return 'N/A';
  
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return average.toFixed(1);
}

  filterParticipants(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchTerm) {
      this.filteredParticipants = [...this.participants];
      return;
    }
    
    this.filteredParticipants = this.participants.filter(p => 
      p.contributeurPrenom.toLowerCase().includes(searchTerm) ||
      p.contributeurNom.toLowerCase().includes(searchTerm) ||
      p.contributeurEmail.toLowerCase().includes(searchTerm) ||
      p.profil.toLowerCase().includes(searchTerm)
    );
  }

  getAvatarUrl(participant: any): string {
    // Implémentez votre logique pour obtenir l'URL de l'avatar
    // Par exemple, vous pouvez utiliser Gravatar ou une autre solution
    return `https://ui-avatars.com/api/?name=${participant.contributeurPrenom}+${participant.contributeurNom}&background=random`;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'actif': return 'status-active';
      case 'inactif': return 'status-inactive';
      case 'en attente': return 'status-pending';
      default: return 'status-default';
    }
  }
}