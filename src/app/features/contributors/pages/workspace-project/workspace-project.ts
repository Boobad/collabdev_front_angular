// workspace-project.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CardTask } from '../../../../shared/ui-components/card-task/card-task';
import { FonctionnalitesService } from '../../../../core/services/fonctionnalites.service';
import { ProjectsService } from '../../../../core/projects-service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  totalTaches: number = 0;
  tachesTerminees: number = 0;

  showNewFeatureForm: boolean = false;
  isCreating: boolean = false;

  projectParticipants: any[] = [];
  hasManager: boolean = false;
  projectManager: any = null;

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
    participantId: null
  };

  showFeedbackModal: boolean = false;
  feedbackTitle: string = '';
  feedbackMessage: string = '';
  isFeedbackSuccess: boolean = false;
  createdFeatureId: number | null = null;

  constructor(
    private fonctService: FonctionnalitesService,
    private projetsService: ProjectsService,
    private location : Location,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.newFeature.projetId = this.projectId;
      this.loadProjectData();
      this.loadProjectDetails();
      this.loadProjectParticipants();
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
      participantId: null
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

  loadProjectParticipants() {
  this.http.get<any[]>(`http://localhost:8080/api/v1/participants/projet/${this.projectId}`)
  .subscribe({
    next: (participants) => {
      this.projectParticipants = participants;

      console.log('Participants récupérés :', participants); // <-- ajoute ça pour debug

      // Cherche le gestionnaire
     this.projectManager = participants.find(p => p.profil?.toUpperCase() === 'GESTIONNAIRE') || null;
this.hasManager = !!this.projectManager;


      console.log('Has manager :', this.hasManager); // <-- debug ici aussi

      this.cdr.detectChanges();
    },
    error: (err) => console.error('Erreur chargement participants:', err)
  });


  }

  loadProjectData() {
    this.isLoading = true;
    this.fonctService.getFonctionnalitesByProjet(this.projectId).subscribe({
      next: (fonctionnalites) => {
        this.organizeTasks(fonctionnalites);
        this.updateTaskCounters();
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

  updateTaskCounters() {
    this.totalTaches = this.todoTasks.length + this.inProgressTasks.length + this.doneTasks.length;
    this.tachesTerminees = this.doneTasks.length;
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
          this.updateTaskCounters();
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
      this.newFeature.motsCles = this.newFeature.motsClesStr
        .split(',')
        .map((m: string) => m.trim())
        .filter((m: string) => m.length > 0);
    } else {
      this.newFeature.motsCles = [];
    }

    const payload = {
      ...this.newFeature,
      exigences: this.newFeature.exigences || [],
      criteresAcceptation: this.newFeature.criteresAcceptation || [],
      participantId: this.newFeature.participantId || null
    };

    this.fonctService.createFeature(payload).subscribe({
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
        this.updateTaskCounters();
        this.cdr.detectChanges();
        
        this.showFeedback(
          'Fonctionnalité créée !',
          `La fonctionnalité "${this.newFeature.titre}" a été ajoutée avec succès.`,
          true,
          createdFeature.id
        );
      },
      error: (err) => {
        console.error('Erreur création fonctionnalité:', err);
        this.isCreating = false;
        this.cdr.detectChanges();
        
        this.showFeedback(
          'Erreur de création',
          'Une erreur est survenue lors de la création de la fonctionnalité. Veuillez réessayer.',
          false
        );
      }
    });
  }

  getProgressPercentage(): number {
    if (this.totalTaches === 0) return 0;
    return Math.round((this.tachesTerminees / this.totalTaches) * 100);
  }

  showFeedback(title: string, message: string, isSuccess: boolean, featureId: number | null = null) {
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.isFeedbackSuccess = isSuccess;
    this.createdFeatureId = featureId;
    this.showFeedbackModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    document.body.style.overflow = '';
  }

  viewCreatedFeature() {
    if (this.createdFeatureId) {
      const element = document.getElementById(`task-${this.createdFeatureId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-task');
        setTimeout(() => element.classList.remove('highlight-task'), 2000);
      }
    }
    this.closeFeedbackModal();
  }
}