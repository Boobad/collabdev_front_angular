import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'app-admin-dash',
  imports: [],
  templateUrl: './admin-dash.html',
  styleUrl: './admin-dash.css'
})
export class AdminDash implements AfterViewInit {
   ngAfterViewInit() {
    // Line Chart
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
          {
            label: 'Projets créés',
            data: [12, 18, 7, 14, 9, 15, 22],
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, .25)',
            pointRadius: 0
          },
          {
            label: 'Projets validés',
            data: [6, 9, 3, 6, 7, 8, 10],
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, .25)',
            pointRadius: 0
          },
          {
            label: 'Projets terminés',
            data: [3, 5, 2, 4, 5, 6, 8],
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            borderColor: '#94a3b8',
            backgroundColor: 'rgba(148, 163, 184, .25)',
            pointRadius: 0
          }
        ]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: '#111827',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            displayColors: false
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#475569', font: { weight: 600 } } },
          y: { grid: { color: '#eef2ff' }, ticks: { color: '#64748b', stepSize: 5 } }
        }
      }
    });

    // Pie Chart
    const pctx = document.getElementById('pieChart') as HTMLCanvasElement;
    new Chart(pctx, {
      type: 'doughnut',
      data: {
        labels: ['Fondateurs', 'Gestionnaires', 'Contributeurs'],
        datasets: [{
          data: [42, 20, 38],
          backgroundColor: ['#60a5fa', '#34d399', '#c084fc'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        cutout: '64%'
      }
    });
  }

}
