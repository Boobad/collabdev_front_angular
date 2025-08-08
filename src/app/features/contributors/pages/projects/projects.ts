import { Component } from '@angular/core';
import { MesCardProject } from '../../../../shared/ui-components/mes-card-project/mes-card-project';
import { CommonModule } from '@angular/common';

interface donneeProject {
  domaine: string;
  coin: number;
  titleProject: string;
  description: string;
  langages: string[];
}
@Component({
  selector: 'app-projects',
  imports: [MesCardProject,CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  projects: donneeProject[] = [
    {
      domaine: 'Web',
      coin: 100,
      titleProject: 'Projet de gestion de tâches',
      description: 'Application web pour la gestion de tâches avec Angular et Node.js.',
      langages: ['Angular', 'Node.js', 'MongoDB']
    },
    {
      domaine: 'Mobile',
      coin: 200,
      titleProject: 'Application de suivi des dépenses',
      description: 'Application mobile pour le suivi des dépenses avec React Native.',
      langages: ['React Native', 'Firebase']
    },
    {
      domaine: 'IoT',
      coin: 500,
      titleProject: 'Application de suivi des dépenses',
      description: 'Application mobile pour le suivi des dépenses avec un Arduino.',
      langages: ['C++', 'Arduino']
    }
  ];
}
