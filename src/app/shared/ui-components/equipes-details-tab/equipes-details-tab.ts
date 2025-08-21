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
  acceptedParticipants: Participant[] = [];
  pendingParticipants: Participant[] = [];
  connectedParticipantId: number | null = null;
  user: any = null;
  projectId: number = 0;

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
        this.loadParticipants();
      }
    });
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Erreur parsing user data:', e);
      }
    }
  }

  loadParticipants(): void {
    this.participantsService.getParticipantsByProject(this.projectId).subscribe({
      next: (data) => {
        this.participants = data;
        this.acceptedParticipants = data.filter(p => p.statut.toLowerCase() === 'accepte');
        this.pendingParticipants = data.filter(p => p.statut.toLowerCase() === 'en_attente');

        const participant = data.find(p => p.contributeurEmail === this.user?.email);
        if (participant) this.connectedParticipantId = participant.id;

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement participants:', err)
    });
  }

  acceptParticipant(participantId: number) {
    this.participantsService.acceptParticipant(participantId).subscribe({
      next: () => this.loadParticipants(),
      error: (err: any) => console.error('Erreur acceptation participant', err)
    });
  }

  rejectParticipant(participantId: number) {
    this.participantsService.rejectParticipant(participantId).subscribe({
      next: () => this.loadParticipants(),
      error: (err: any) => console.error('Erreur refus participant', err)
    });
  }

  filterParticipants(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.acceptedParticipants = this.participants
      .filter(p => p.statut.toLowerCase() === 'accepte')
      .filter(p => p.contributeurPrenom.toLowerCase().includes(searchTerm) || 
                   p.contributeurNom.toLowerCase().includes(searchTerm) ||
                   p.contributeurEmail.toLowerCase().includes(searchTerm) ||
                   p.profil.toLowerCase().includes(searchTerm));
    
    this.pendingParticipants = this.participants
      .filter(p => p.statut.toLowerCase() === 'en_attente')
      .filter(p => p.contributeurPrenom.toLowerCase().includes(searchTerm) || 
                   p.contributeurNom.toLowerCase().includes(searchTerm) ||
                   p.contributeurEmail.toLowerCase().includes(searchTerm) ||
                   p.profil.toLowerCase().includes(searchTerm));
  }

  getAvatarUrl(participant: any): string {
    return `https://ui-avatars.com/api/?name=${participant.contributeurPrenom}+${participant.contributeurNom}&background=random`;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'actif': return 'status-active';
      case 'inactif': return 'status-inactive';
      case 'en_attente': return 'status-pending';
      default: return 'status-default';
    }
  }
}
