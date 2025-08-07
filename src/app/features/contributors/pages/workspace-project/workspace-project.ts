// workspace-project.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { WspacePageHeader } from '../../../../shared/wspace-page-header/wspace-page-header';
import { WspacePageRightSide } from '../../../../shared/wspace-page-right-side/wspace-page-right-side';
import { CardTask } from '../../../../shared/ui-components/card-task/card-task';

@Component({
  selector: 'app-workspace-project',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    WspacePageHeader,
    WspacePageRightSide,
    CardTask
  ],
  templateUrl: './workspace-project.html',
  styleUrls: ['./workspace-project.css']
})
export class WorkspaceProject implements OnInit {
  // Tableaux pour les différentes colonnes
  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  // Charge les tâches depuis le localStorage
  loadTasks() {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      this.todoTasks = tasks.todo || [];
      this.inProgressTasks = tasks.inProgress || [];
      this.doneTasks = tasks.done || [];
    } else {
      // Valeurs par défaut si aucune donnée sauvegardée
      this.todoTasks = [
        { id: 1, title: 'Interface de connexion patient', description: 'Créer l\'interface de connexion pour les patients', tags: ['Frontend', 'UI/UX'], priority: 'high' },
        { id: 2, title: 'API Authentification', description: 'Développer le endpoint d\'authentification', tags: ['Backend'], priority: 'medium' },
        { id: 3, title: 'Maquettes dashboard', description: 'Finaliser les maquettes Figma', tags: ['Design'], priority: 'low' }
      ];

      this.inProgressTasks = [
        { id: 4, title: 'Base de données patients', description: 'Modéliser la structure de la DB', tags: ['Backend'], priority: 'high' },
        { id: 5, title: 'Component header', description: 'Intégrer le header responsive', tags: ['Frontend'], priority: 'medium' }
      ];

      this.doneTasks = [
        { id: 6, title: 'Setup projet', description: 'Initialiser le repository Git', tags: ['DevOps'], priority: 'low' },
        { id: 7, title: 'User stories', description: 'Rédiger toutes les user stories', tags: ['Documentation'], priority: 'medium' }
      ];

      this.saveTasks(); // Sauvegarde les tâches par défaut
    }
  }

  // Sauvegarde les tâches dans le localStorage
  saveTasks() {
    const tasks = {
      todo: this.todoTasks,
      inProgress: this.inProgressTasks,
      done: this.doneTasks
    };
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }

  // Gestion du drag and drop
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Déplacement dans la même colonne
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Transfert entre colonnes
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.saveTasks(); // Sauvegarde après chaque modification
  }

  // Ajoute une nouvelle tâche
  addTask(column: string) {
    const newTask = {
      id: Date.now(), // ID unique basé sur le timestamp
      title: 'Nouvelle tâche',
      description: 'Description de la tâche',
      tags: [],
      priority: 'medium'
    };

    switch (column) {
      case 'todo':
        this.todoTasks.unshift(newTask);
        break;
      case 'inProgress':
        this.inProgressTasks.unshift(newTask);
        break;
      case 'done':
        this.doneTasks.unshift(newTask);
        break;
    }

    this.saveTasks();
  }

  // Fonction de suivi pour ngFor
  trackById(index: number, task: any): number {
    return task.id;
  }
}
