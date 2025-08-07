import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅️ Ajoute ceci
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-progression-tab',
  standalone: true, // ⬅️ Ajoute si ce n'est pas déjà le cas
  imports: [CommonModule], // ⬅️ Importe le module pour ngStyle, ngFor, etc.
  templateUrl: './progression-tab.html',
  styleUrls: ['./progression-tab.css']
})
export class ProgressionTab implements AfterViewInit {
  progressItems = [
    { label: 'Conception', percent: 75, color: '#4361ee' },
    { label: 'Développement Frontend', percent: 40, color: '#3f37c9' },
    { label: 'Développement Backend', percent: 35, color: '#4cc9f0' },
    { label: 'Tests', percent: 10, color: '#7209b7' }
  ];

  ngAfterViewInit(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Terminé', 'En cours', 'Non commencé'],
        datasets: [{
          data: [48, 32, 20],
          backgroundColor: ['#4361ee', '#4cc9f0', '#e9ecef'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
