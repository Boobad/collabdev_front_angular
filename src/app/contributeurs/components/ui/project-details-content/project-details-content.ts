import { Component } from '@angular/core';
import { ApercuTab } from '../apercu-tab/apercu-tab';
import { CommonModule } from '@angular/common';
import { TachesTab } from '../taches-tab/taches-tab';

@Component({
  selector: 'app-project-details-content',
  imports: [CommonModule],
  templateUrl: './project-details-content.html',
  styleUrl: './project-details-content.css'
})
export class ProjectDetailsContent {
 activeTab: string = 'overview'; // valeur par défaut (exemple)

  // Tu peux aussi créer une méthode pour changer d'onglet
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
}
