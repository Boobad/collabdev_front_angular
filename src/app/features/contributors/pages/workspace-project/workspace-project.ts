import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CardTask } from '../../../../shared/ui-components/card-task/card-task';
import { FonctionnalitesService } from '../../../../core/services/fonctionnalites.service';
import { ProjectsService } from '../../../../core/projects-service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workspace-project',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, CardTask],
  templateUrl: './workspace-project.html',
  styleUrls: ['./workspace-project.css']
})
export class WorkspaceProject implements OnInit {
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];
  
  projectId: number = 1;
  projectDetails: any = {};
  isLoading: boolean = true;
  activeTab: string = 'kanban';

  showNewFeatureForm: boolean = false;
  isCreating: boolean = false;

  newFeature: any = {
    titre: '',
    contenu: '',
    statusFeatures: 'A_FAIRE',
    dateEcheance: '',
    exigences: [],
    criteresAcceptation: [],
    importance: 'MOYENNE',
    motsCles: [],
    motsClesStr: '',
    projetId: 0,
    participantId: 0
  };

  constructor(
    private fonctService: FonctionnalitesService,
    private projetsService: ProjectsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.newFeature.projetId = this.projectId;
      this.loadProjectData();
      this.loadProjectDetails();
    });
  }

  handleOverlayClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.toggleNewFeatureForm();
    }
  }

  toggleNewFeatureForm() {
    this.showNewFeatureForm = !this.showNewFeatureForm;
    
    // Empêche le défilement de la page quand le modal est ouvert
    if (this.showNewFeatureForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      this.resetNewFeatureForm();
    }
  }

  resetNewFeatureForm() {
    this.newFeature = {
      titre: '',
      contenu: '',
      statusFeatures: 'A_FAIRE',
      dateEcheance: '',
      exigences: [],
      criteresAcceptation: [],
      importance: 'MOYENNE',
      motsCles: [],
      motsClesStr: '',
      projetId: this.projectId,
      participantId: 0
    };
  }

  loadProjectDetails() {
    this.projetsService.getProjetById(this.projectId).subscribe({
      next: (details) => {
        this.projectDetails = details;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement détails projet:', err);
      }
    });
  }

  loadProjectData() {
    this.isLoading = true;
    this.fonctService.getFonctionnalitesByProjet(this.projectId).subscribe({
      next: (fonctionnalites) => {
        this.organizeTasks(fonctionnalites);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  organizeTasks(fonctionnalites: any[]) {
    this.todoTasks = [];
    this.inProgressTasks = [];
    this.doneTasks = [];

    fonctionnalites.forEach(f => {
      const task = this.convertToTask(f);
      switch(f.statusFeatures) {
        case 'A_FAIRE': this.todoTasks.push(task); break;
        case 'EN_COURS': this.inProgressTasks.push(task); break;
        case 'TERMINE': this.doneTasks.push(task); break;
        default: this.todoTasks.push(task);
      }
    });
    this.cdr.detectChanges();
  }

  convertToTask(fonctionnalite: any): any {
    return {
      id: fonctionnalite.id ?? 0,
      title: fonctionnalite.titre,
      description: fonctionnalite.contenu,
      status: fonctionnalite.statusFeatures,
      assignee: fonctionnalite.participantNomComplet || 'Non assigné',
      assigneeEmail: fonctionnalite.participantEmail || '',
      tags: fonctionnalite.motsCles || [],
      priority: this.getPriority(fonctionnalite.importance),
      progress: this.getProgress(fonctionnalite.statusFeatures),
      deadline: fonctionnalite.dateEcheance,
      isOverdue: this.checkIfOverdue(fonctionnalite.dateEcheance)
    };
  }

  getPriority(importance: string): string {
    switch(importance) {
      case 'HAUTE': return 'high';
      case 'MOYENNE': return 'medium';
      default: return 'low';
    }
  }

  getProgress(status: string): number {
    switch(status) {
      case 'A_FAIRE': return 0;
      case 'EN_COURS': return 50;
      case 'TERMINE': return 100;
      default: return 0;
    }
  }

  checkIfOverdue(dateEcheance: string): boolean {
    if (!dateEcheance) return false;
    return new Date(dateEcheance) < new Date();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      
      task.status = newStatus;
      task.progress = this.getProgress(newStatus);

      this.fonctService.updateStatus(task.id, newStatus).subscribe({
        next: () => {
          console.log(`Statut de la fonctionnalité ${task.id} mis à jour avec succès.`);
        },
        error: (err) => {
          console.error(`Erreur lors de la mise à jour du statut de la fonctionnalité ${task.id}:`, err);
        }
      });
    }
    this.cdr.detectChanges();
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  getStatusFromContainerId(containerId: string): string {
    switch(containerId) {
      case 'cdk-drop-list-0': return 'A_FAIRE';
      case 'cdk-drop-list-1': return 'EN_COURS';
      case 'cdk-drop-list-2': return 'TERMINE';
      default: return 'A_FAIRE';
    }
  }

  trackById(index: number, item: any): number {
    return item.id ?? index;
  }

  createFeature() {
    if (!this.newFeature.titre || this.newFeature.titre.trim() === '') {
      alert('Le titre est obligatoire');
      return;
    }

    this.isCreating = true;

    if (this.newFeature.motsClesStr) {
      this.newFeature.motsCles = this.newFeature.motsClesStr.split(',').map((m: string) => m.trim());
    } else {
      this.newFeature.motsCles = [];
    }

    this.fonctService.createFeature(this.newFeature).subscribe({
      next: (createdFeature) => {
        const task = this.convertToTask(createdFeature);
        switch (createdFeature.statusFeatures) {
          case 'A_FAIRE': this.todoTasks.unshift(task); break;
          case 'EN_COURS': this.inProgressTasks.unshift(task); break;
          case 'TERMINE': this.doneTasks.unshift(task); break;
          default: this.todoTasks.unshift(task);
        }
        this.isCreating = false;
        this.toggleNewFeatureForm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur création fonctionnalité:', err);
        alert('Erreur lors de la création de la fonctionnalité.');
        this.isCreating = false;
        this.cdr.detectChanges();
      }
    });
  }
}