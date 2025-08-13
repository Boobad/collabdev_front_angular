import { 
  Component, 
  AfterViewInit, 

  ViewChild, 
  ElementRef, 
  Input, 
  OnChanges, 
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

type FeatureStatus = 'TERMINE' | 'EN_COURS' | 'A_FAIRE';
type PriorityLevel = 'HAUTE' | 'MOYENNE' | 'FAIBLE';

interface ProjectFeature {
  id: number;
  titre: string;
  contenu?: string;
  statusFeatures: FeatureStatus;
  participantEmail?: string;
  importance?: PriorityLevel;
  dateEcheance?: string;
}

@Component({
  selector: 'app-progression-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progression-tab.html',
  styleUrls: ['./progression-tab.css']
})
export class ProgressionTab implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('progressChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() projectId: number = 0;
  private chart: Chart | null = null;

  features: ProjectFeature[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  completionPercent: number = 0;
  tasksCompleted: number = 0;
  totalTasks: number = 0;
  collaboratorsCount: number = 0;

  progressItems = [
    { label: 'Hautes priorités', percent: 0, color: '#7209b7' },
    { label: 'Moyennes priorités', percent: 0, color: '#3f37c9' },
    { label: 'Basses priorités', percent: 0, color: '#4cc9f0' }
  ];

  private routeSub?: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupération du projectId depuis la route si non passé en input
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id && id > 0 && id !== this.projectId) {
        this.projectId = id;
        this.fetchProjectFeatures();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le projectId vient d’un composant parent via @Input()
    if (changes['projectId'] && this.projectId > 0) {
      this.fetchProjectFeatures();
    }
  }

  ngAfterViewInit(): void {
    // On évite fetch ici, il est géré dans ngOnInit et ngOnChanges
  }

  ngOnDestroy(): void {
    this.destroyChart();
    this.routeSub?.unsubscribe();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  public fetchProjectFeatures(): void {
    if (!this.projectId || this.projectId <= 0) {
      this.error = 'ID de projet invalide';
      this.isLoading = false;
      this.cdRef.detectChanges();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.cdRef.detectChanges();

    this.http.get<ProjectFeature[]>(`http://localhost:8080/api/v1/fonctionnalites/projet/${this.projectId}`)
      .subscribe({
        next: (data) => {
          this.features = data;
          if (this.features.length === 0) {
            this.error = 'Aucune fonctionnalité trouvée pour ce projet';
            this.isLoading = false;
            this.cdRef.detectChanges();
            return;
          }
          this.calculateStats();
          this.isLoading = false;
          this.cdRef.detectChanges();
          setTimeout(() => this.renderChart(), 0);
        },
        error: (err) => {
          this.error = `Erreur: ${err.message || 'Serveur inaccessible'}`;
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
  }

  private calculateStats(): void {
    this.totalTasks = this.features.length;

    const statusCounts: Record<FeatureStatus, number> = { TERMINE: 0, EN_COURS: 0, A_FAIRE: 0 };
    const collaborators = new Set<string>();
    const priorityCounts: Record<PriorityLevel, number> = { HAUTE: 0, MOYENNE: 0, FAIBLE: 0 };

    this.features.forEach(feature => {
      statusCounts[feature.statusFeatures]++;
      if (feature.participantEmail) {
        collaborators.add(feature.participantEmail);
      }
      if (feature.importance) {
        priorityCounts[feature.importance]++;
      }
    });

    this.tasksCompleted = statusCounts.TERMINE;
    this.completionPercent = Math.round((this.tasksCompleted / this.totalTasks) * 100);
    this.collaboratorsCount = collaborators.size;

    this.progressItems[0].percent = Math.round((priorityCounts.HAUTE / this.totalTasks) * 100);
    this.progressItems[1].percent = Math.round((priorityCounts.MOYENNE / this.totalTasks) * 100);
    this.progressItems[2].percent = Math.round((priorityCounts.FAIBLE / this.totalTasks) * 100);
  }

  private renderChart(): void {
    this.destroyChart();

    if (!this.chartRef?.nativeElement) {
      console.error('Élément canvas non trouvé');
      return;
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Impossible d\'obtenir le contexte du canvas');
      return;
    }

    const termineCount = this.features.filter(f => f.statusFeatures === 'TERMINE').length;
    const enCoursCount = this.features.filter(f => f.statusFeatures === 'EN_COURS').length;
    const aFaireCount = this.features.filter(f => f.statusFeatures === 'A_FAIRE').length;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Terminé', 'En cours', 'À faire'],
        datasets: [{
          data: [termineCount, enCoursCount, aFaireCount],
          backgroundColor: ['#4361ee', '#4cc9f0', '#e9ecef'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 12 },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}
