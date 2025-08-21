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
  @Output() statusChange = new EventEmitter<{task: any, newStatus: string}>();

  getPriorityClass() {
    return {
      'high': this.task?.priority === 'high',
      'medium': this.task?.priority === 'medium',
      'low': this.task?.priority === 'low'
    };
  }

  getStatusClass() {
    return {
      'todo': this.task?.status === 'A_FAIRE',
      'inprogress': this.task?.status === 'EN_COURS',
      'done': this.task?.status === 'TERMINE'
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifiée';
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
}