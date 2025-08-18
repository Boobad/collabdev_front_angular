import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';
import { SecteurDisplayPipe, StatutDisplayPipe } from './pipes';

@Component({
  selector: 'app-project-details-header',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SecteurDisplayPipe, StatutDisplayPipe, RouterLink],
  templateUrl: './project-details-header.html',
  styleUrls: ['./project-details-header.css']
})
export class ProjectDetailsHeader implements OnInit {
  project: any = null;
  participants: any[] = [];

  loading = true;
  error = false;

  showEditModal = false;
  showDeleteModal = false;
  showShareModal = false;
  showCompleteModal = false;

  secteurs: string[] = ['SANTE', 'EDUCATION', 'AGRICULTURE', 'TRANSPORTS', 'FINANCE', 'INFORMATIQUE'];

  private userId: string | null = null;
  private userEmail: string | null = null;

  constructor(
    private location: Location,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userEmail = localStorage.getItem('userEmail');
    console.log('👤 Utilisateur connecté :', { userId: this.userId, userEmail: this.userEmail });

    this.route.params.subscribe(params => {
      const projectId = params['id'];
      console.log('📂 Chargement du projet avec ID :', projectId);

      this.loadProject(projectId);
      this.loadParticipants(projectId);
    });
  }

  loadProject(id: string): void {
    this.loading = true;
    this.error = false;
    this.project = null;
    this.cd.detectChanges();

    this.projectsService.get(id).subscribe({
      next: project => {
        this.project = project;
        this.loading = false;
        console.log('✅ Projet chargé :', this.project);
        this.cd.detectChanges();
      },
      error: err => {
        console.error('❌ Erreur chargement projet :', err);
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

 loadParticipants(id: string): void {
  console.log('📂 Chargement des participants du projet ID :', id);
  this.projectsService.getParticipants(id).subscribe({
    next: data => {
      this.participants = data;
      console.log('✅ Participants chargés :');
      console.table(this.participants); // ✅ lisible
      this.cd.detectChanges();
    },
    error: err => console.error("❌ Erreur participants :", err)
  });
}


  goBack() { 
    console.log('🔙 Retour arrière'); 
    this.location.back(); 
  }

  openEditModal() { console.log('✏️ Ouverture modal édition'); this.showEditModal = true; }
  closeEditModal() { console.log('❌ Fermeture modal édition'); this.showEditModal = false; }

  openDeleteModal() { console.log('🗑️ Ouverture modal suppression'); this.showDeleteModal = true; }
  closeDeleteModal() { console.log('❌ Fermeture modal suppression'); this.showDeleteModal = false; }

  openShareModal() { console.log('🔗 Ouverture modal partage'); this.showShareModal = true; }
  closeShareModal() { console.log('❌ Fermeture modal partage'); this.showShareModal = false; }

  openCompleteModal() { console.log('✅ Ouverture modal terminer projet'); this.showCompleteModal = true; }
  closeCompleteModal() { console.log('❌ Fermeture modal terminer projet'); this.showCompleteModal = false; }

  isPorteur(): boolean {
    const result = this.project?.porteurId?.toString() === this.userId;
    console.log('🔍 Vérification si utilisateur est porteur du projet :', result);
    return result;
  }

 isGestionnaire(): boolean {
  console.log('👤 Email connecté :', this.userEmail);
  const result = this.participants.some(p =>
    p.profil === 'GESTIONNAIRE' &&
    p.contributeurEmail === this.userEmail &&
    p.statut === 'ACCEPTE'
  );
  console.log('🔍 Vérification si utilisateur est gestionnaire :', result);
  return result;
}


  updateProject() {
    if (!this.project) return;
    console.log('✏️ Mise à jour du projet :', this.project);

    this.projectsService.update(this.project.id, this.project).subscribe({
      next: updated => { 
        this.project = updated; 
        this.closeEditModal(); 
        console.log('✅ Projet mis à jour :', updated);
      },
      error: err => console.error('❌ Erreur update projet :', err)
    });
  }

  deleteProject() {
    if (!this.project) return;
    console.log('🗑️ Suppression projet ID :', this.project.id);

    this.projectsService.deleteProject(this.project.id).subscribe({
      next: () => { 
        console.log('✅ Projet supprimé'); 
        this.closeDeleteModal(); 
        this.goBack(); 
      },
      error: err => {
        console.error('❌ Erreur suppression projet :', err);
        alert('Impossible de supprimer le projet : ' + err.error);
      }
    });
  }

  completeProject() {
    if (!this.project) return;
    console.log('🚀 Tentative de terminer projet ID :', this.project.id);

    this.projectsService.completeProject(this.project.id).subscribe({
      next: updated => {
        this.project = updated;
        this.closeCompleteModal();
        console.log('✅ Projet terminé avec succès :', updated);
        alert('✅ Projet marqué comme terminé !');
      },
      error: err => {
        console.error('❌ Erreur completion projet :', err);
        alert('❌ Impossible de terminer le projet.');
      }
    });
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch(status) {
      case 'EN_COURS': return 'in-progress';
      case 'TERMINE': return 'completed';
      case 'EN_ATTENTE': return 'pending';
      default: return '';
    }
  }

  getSecteurClass(secteur?: string): string {
    if (!secteur) return '';
    switch(secteur) {
      case 'SANTE': return 'health';
      case 'EDUCATION': return 'education';
      case 'AGRICULTURE': return 'agriculture';
      case 'TRANSPORTS': return 'transports';
      case 'FINANCE': return 'finance';
      case 'INFORMATIQUE': return 'informatique';
      default: return '';
    }
  }

  getSecteurIcon(secteur?: string): string {
    if (!secteur) return 'fas fa-question-circle';
    switch(secteur) {
      case 'SANTE': return 'fas fa-heartbeat';
      case 'EDUCATION': return 'fas fa-graduation-cap';
      case 'AGRICULTURE': return 'fas fa-tractor';
      case 'TRANSPORTS': return 'fas fa-bus';
      case 'FINANCE': return 'fas fa-coins';
      case 'INFORMATIQUE': return 'fas fa-laptop-code';
      default: return 'fas fa-question-circle';
    }
  }

  share(network: string) {
    if (!this.project) return;

    console.log('📤 Partage du projet sur :', network);

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.project.titre || 'Projet');
    let shareUrl = '';

    switch(network) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`; break;
      default: return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}
