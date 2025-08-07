import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './card-task.html',
  styleUrls: ['./card-task.css']
})
export class CardTask {
  @Input() task: any;
  @Output() taskReserved = new EventEmitter<any>();
  @Output() menuClicked = new EventEmitter<{event: Event, task: any}>();

  isDragging = false;
  showMenu = false;

  // Gestion des classes de priorité
  getPriorityClass() {
    return {
      'high': this.task?.priority === 'high',
      'medium': this.task?.priority === 'medium',
      'low': this.task?.priority === 'low'
    };
  }

  // Texte de priorité
  getPriorityText() {
    return this.task?.priority === 'high' ? 'HAUTE PRIORITÉ' :
           this.task?.priority === 'medium' ? 'MOYENNE PRIORITÉ' : 'BASSE PRIORITÉ';
  }

  // Classes pour les tags
  getTagClass(tag: string) {
    return {
      'frontend': tag === 'Frontend',
      'backend': tag === 'Backend',
      'ux': tag === 'UI/UX',
      'design': tag === 'Design',
      'devops': tag === 'DevOps',
      'documentation': tag === 'Documentation'
    };
  }

  // Gestion du drag
  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  // Formatage de la date
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  // Action de réservation
  reserveTask() {
    if (this.task) {
      this.task.reserved = !this.task.reserved;
      this.taskReserved.emit(this.task);
    }
  }

  // Toggle menu contextuel
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuClicked.emit({event, task: this.task});
  }
}
