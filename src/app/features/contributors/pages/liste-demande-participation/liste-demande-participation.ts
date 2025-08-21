import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ParticipantsService } from '../../../../core/services/participants.service';

@Component({
  selector: 'app-liste-demande-participation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-demande-participation.html',
  styleUrls: ['./liste-demande-participation.css']
})
export class ListeDemandeParticipation implements OnInit {
  searchQuery = '';
  statusFilter = 'all';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  allCandidates: any[] = [];
  filteredCandidates: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participantsService: ParticipantsService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idProjetParam = this.route.snapshot.paramMap.get('idProjet');
    const idProjet = Number(idProjetParam);

    if (!idProjet || isNaN(idProjet) || idProjet <= 0) {
      console.error(`❌ ID projet invalide : "${idProjetParam}"`);
      // On peut rediriger vers une page d'erreur ou le dashboard
      this.router.navigate(['/dashboard']);
      return;
    }

    console.log(`✅ ID projet détecté : ${idProjet}`);
    this.loadParticipants(idProjet);
  }

  loadParticipants(idProjet: number) {
    console.log(`📡 Chargement des participants du projet ${idProjet}...`);

    this.participantsService.getParticipantsByProject(idProjet).subscribe({
      next: (data) => {
        console.log(`✅ ${data.length} participants reçus depuis l'API`);
        this.allCandidates = data.map((p) => ({
          id: p.id,
          name: `${p.contributeurPrenom} ${p.contributeurNom}`,
          email: p.contributeurEmail,
          date: '', // non fourni par l’API
          profil: p.profil,
          projetTitre: p.projetTitre,
          status: this.mapStatut(p.statut),
          score: parseInt(p.scoreQuiz, 10) || 0,
          notifications: 0
        }));
        this.filteredCandidates = [...this.allCandidates];
        this.calculateTotalPages();
        this.cdr.detectChanges(); // Forcer Angular à rafraîchir l'affichage
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des participants', err);
      }
    });
  }

  mapStatut(apiStatut: string): string {
    switch (apiStatut) {
      case 'ACCEPTE': return 'approved';
      case 'REFUSE': return 'rejected';
      case 'EN_ATTENTE': return 'pending';
      default: return 'pending';
    }
  }

 goBack() {
  this.location.back();
}

  filterCandidates() {
    this.filteredCandidates = this.allCandidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            candidate.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || candidate.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  updateStatus(id: number, status: 'approved' | 'rejected') {
    const candidate = this.allCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.status = status;
      this.filterCandidates();
    }
  }

  notify(id: number) {
    const candidate = this.allCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.notifications++;
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredCandidates.length / this.itemsPerPage) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedCandidates() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCandidates.slice(start, start + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    return statusTexts[status] || status;
  }
}
