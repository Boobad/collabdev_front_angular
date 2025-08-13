import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectsService } from '../../../core/services/projects.service';
import { SecteurDisplayPipe, StatutDisplayPipe } from './pipes';

@Component({
  selector: 'app-project-details-header',
  standalone: true,
  imports: [CommonModule, DatePipe, SecteurDisplayPipe, StatutDisplayPipe,RouterLink],
  templateUrl: './project-details-header.html',
  styleUrls: ['./project-details-header.css']
})
export class ProjectDetailsHeader implements OnInit {
  project: any = null;
  
  loading = true;
  error = false;



  constructor(
    private location: Location,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.loadProject(projectId);
    });
  }

   showShareModal = false;

  // ...

  openShareModal() {
    this.showShareModal = true;
  }

  closeShareModal() {
    this.showShareModal = false;
  }

  share(network: string) {
    if (!this.project) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.project.titre || 'Projet');

    let shareUrl = '';

    switch(network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  loadProject(id: string): void {
    this.loading = true;
    this.error = false;
    this.project = null;
    this.cd.detectChanges();

    this.projectsService.get(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading project:', err);
        this.error = true;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // Retourne la classe CSS selon le statut (pour la couleur)
  getStatusClass(status?: string): string {
    if (!status) return '';
    switch(status) {
      case 'EN_COURS': return 'in-progress';
      case 'TERMINE': return 'completed';
      case 'EN_ATTENTE': return 'pending';
      default: return '';
    }
  }

  // Retourne la classe CSS selon le secteur (pour la couleur)
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

  // Pour les icônes FontAwesome (classes)
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
}
