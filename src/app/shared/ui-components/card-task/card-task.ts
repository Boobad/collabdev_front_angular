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
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() archive = new EventEmitter<void>();
  @Output() taskReserved = new EventEmitter<any>();

  isDragging = false;
  showMenu = false;

  getPriorityClass() {
    return {
      'high': this.task?.priority === 'high',
      'medium': this.task?.priority === 'medium',
      'low': this.task?.priority === 'low'
    };
  }

  getPriorityText() {
    return this.task?.priority === 'high' ? 'HAUTE PRIORITÉ' :
           this.task?.priority === 'medium' ? 'MOYENNE PRIORITÉ' : 'BASSE PRIORITÉ';
  }

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

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  reserveTask() {
    if (this.task) {
      this.task.reserved = !this.task.reserved;
      this.taskReserved.emit(this.task);
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  onEdit() {
    this.edit.emit();
    this.closeMenu();
  }

  onDelete() {
    this.delete.emit();
    this.closeMenu();
  }

  onDuplicate() {
    this.duplicate.emit();
    this.closeMenu();
  }

  onArchive() {
    this.archive.emit();
    this.closeMenu();
  }
}
