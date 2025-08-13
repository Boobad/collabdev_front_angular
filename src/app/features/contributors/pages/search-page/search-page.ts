import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, PipeTransform, Pipe } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, timer, of } from 'rxjs';
import { debounceTime, takeUntil, switchMap, catchError, distinctUntilChanged, filter } from 'rxjs/operators';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, completeWords = true, ellipsis = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }
    
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}

interface Projet {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  secteur: string;
  status: string;
  niveau: string;
  dateCreation: string;
  createurNom: string;
  createurPrenom: string;
  nombreParticipants: number;
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TruncatePipe],
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.css']
})
export class SearchPage implements OnInit, OnDestroy {
  secteurVal: string = '';
  domaineVal: string = '';
  niveauVal: string = '';
  searchText: string = '';
  
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;
  errorMessage: string | null = null;
  results: Projet[] = [];
  filteredResults: Projet[] = [];
  
  // Sujets pour gérer les différents types de changements
  private searchText$ = new Subject<string>();
  private filters$ = new Subject<void>();
  private forceRefresh$ = new Subject<void>();
  
  // Cache simple
  private cache = new Map<string, Projet[]>();
  private lastParams: string = '';

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Gestion des paramètres d'URL
    this.route.queryParams.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ).subscribe(params => {
      this.searchText = params['q']?.toLowerCase() || '';
      this.secteurVal = params['secteur']?.toLowerCase() || '';
      this.domaineVal = params['domaine']?.toLowerCase() || '';
      this.niveauVal = params['niveau']?.toLowerCase() || '';
      this.forceRefresh$.next(); // Force le rafraîchissement
    });

    // Gestion de la recherche texte (debounce 300ms)
    this.searchText$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchText => {
      this.searchText = searchText;
      this.filterResults();
      this.updateQueryParams();
    });

    // Gestion des filtres (debounce 500ms)
    this.filters$.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchProjets();
    });

    // Force le premier chargement
    this.forceRefresh$.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTextChange() {
    this.searchText$.next(this.searchText.toLowerCase());
  }

  onFilterChange() {
    this.filters$.next();
  }

  fetchProjets() {
    const params = new HttpParams()
      .set('domaine', this.domaineVal.toUpperCase())
      .set('secteur', this.secteurVal.toUpperCase())
      .set('niveau', this.niveauVal.toUpperCase());
    
    const paramString = params.toString();

    // Utilisation du cache si disponible
    if (this.cache.has(paramString)) {
      this.results = this.cache.get(paramString) || [];
      this.filterResults();
      return;
    }

    // Si les paramètres n'ont pas changé et qu'on a déjà des résultats
    if (paramString === this.lastParams && this.results.length > 0) {
      this.filterResults();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.lastParams = paramString;
    this.cdr.detectChanges();

    // Simulation de délai minimum pour éviter les scintillements
    const fetchTimer = timer(300);

    this.http.get<Projet[]>('http://localhost:8080/api/v1/projets/ouverts', { params }).pipe(
      switchMap(data => fetchTimer.pipe(switchMap(() => of(data)))),
      catchError(error => {
        this.handleError(error);
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.results = data;
      this.cache.set(paramString, data);
      this.filterResults();
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private handleError(error: any) {
    this.isLoading = false;
    this.errorMessage =
      error.name === 'TimeoutError' || error.status === 504
        ? 'La requête a pris trop de temps. Vérifiez votre connexion.'
        : error.status === 404
        ? 'Aucun projet trouvé pour ces critères.'
        : 'Une erreur est survenue. Veuillez réessayer.';
    this.results = [];
    this.filteredResults = [];
    this.cdr.detectChanges();
    console.error('API Error:', error);
  }

  filterResults() {
    if (!this.results.length) return;
    
    this.filteredResults = this.results.filter(item => 
      this.searchText === '' || 
      item.titre.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.secteurVal = '';
    this.domaineVal = '';
    this.niveauVal = '';
    this.searchText = '';
    this.updateQueryParams();
    this.forceRefresh$.next();
  }

  retryFetch() {
    this.forceRefresh$.next();
  }

  viewProject(id: number) {
    this.router.navigate(['/project', id]);
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.searchText || null,
        secteur: this.secteurVal || null,
        domaine: this.domaineVal || null,
        niveau: this.niveauVal || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true // Évite l'accumulation dans l'historique
    });
  }

  trackByProjectId(index: number, project: Projet): number {
    return project.id;
  }
}