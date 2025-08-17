import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
 selector: 'app-projet-admin',
 standalone: true,
 imports: [CommonModule, FormsModule, DatePipe],
 templateUrl: './projet-admin.html',
 styleUrl: './projet-admin.css'
})
export class ProjetAdmin {
 showMessage: boolean = false;
 isSuccess: boolean = true;
 selectedProject: any = null;


 // Données des projets (tableau dynamique)
 projects: any[] = [
   { id: 1, name: 'Projet 1', secteur: 'Énergie', date: new Date(2025, 3, 20), etat: 'En attente' },
   { id: 2, name: 'Projet 2', secteur: 'Éducation', date: new Date(2025, 5, 22), etat: 'En cours' },
   { id: 3, name: 'Projet 3', secteur: 'Santé', date: new Date(2025, 2, 15), etat: 'Terminer' },
   { id: 4, name: 'Projet 4', secteur: 'Technologie', date: new Date(2025, 8, 10), etat: 'En attente' },
   { id: 5, name: 'Projet 5', secteur: 'Finance', date: new Date(2025, 11, 5), etat: 'En cours' },
 ];


 filteredProjects: any[] = [...this.projects];
 uniqueSecteurs: string[] = [];
 secteurFilter: string = '';
 dateFilter: string = '';
 etatFilter: string = '';
 selectedProjects: number[] = [];


 constructor() {
   this.updateUniqueSecteurs();
 }


 // Mettre à jour les secteurs uniques à partir des données des projets
 updateUniqueSecteurs() {
   const secteursSet = new Set(this.projects.map(project => project.secteur));
   this.uniqueSecteurs = Array.from(secteursSet);
 }


 // Filtrer les projets
 onFilterChange() {
   this.filteredProjects = this.projects.filter(project => {
     const dateYear = project.date.getFullYear().toString();
     return (
       (this.secteurFilter === '' || project.secteur === this.secteurFilter) &&
       (this.dateFilter === '' || dateYear === this.dateFilter) &&
       (this.etatFilter === '' || project.etat === this.etatFilter)
     );
   });
 }


 // Gérer la sélection des projets
 toggleSelection(projectId: number) {
   if (this.selectedProjects.includes(projectId)) {
     this.selectedProjects = this.selectedProjects.filter(id => id !== projectId);
   } else {
     this.selectedProjects.push(projectId);
   }
 }


 // Valider les projets sélectionnés : changer l'état à "Terminer"
 onValidateClick() {
   if (this.selectedProjects.length === 0) {
     alert('Veuillez sélectionner au moins un projet.');
     return;
   }
   this.projects = this.projects.map(project => {
     if (this.selectedProjects.includes(project.id)) {
       return { ...project, etat: 'Terminer' };
     }
     return project;
   });
   this.isSuccess = true;
   this.showMessage = true;
   this.selectedProjects = []; // Réinitialiser la sélection
   this.onFilterChange(); // Rafraîchir le filtre
   this.updateUniqueSecteurs(); // Mettre à jour les secteurs si nécessaire
 }


 // Rejeter les projets sélectionnés : les supprimer du tableau
 onRejectClick() {
   if (this.selectedProjects.length === 0) {
     alert('Veuillez sélectionner au moins un projet.');
     return;
   }
   this.projects = this.projects.filter(project => !this.selectedProjects.includes(project.id));
   this.isSuccess = false;
   this.showMessage = true;
   this.selectedProjects = []; // Réinitialiser la sélection
   this.onFilterChange(); // Rafraîchir le filtre
   this.updateUniqueSecteurs(); // Mettre à jour les secteurs
 }


 hideMessage() {
   this.showMessage = false;
 }


 // Afficher les détails d'un projet (optionnel)
 showDetails(project: any) {
   this.selectedProject = project;
 }
}

