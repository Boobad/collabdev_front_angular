import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonModule, DatePipe } from '@angular/common';
import { apiUrl } from '../../../core/services/api.config';

interface Commentaire {
  id: number;
  contenu: string;
  creationDate: string;
  auteurId: number;
  auteurNomComplet: string;
  auteurPhotoProfilUrl?: string | null;
  parentId?: number | null;
  reponses: Commentaire[];
}

@Component({
  selector: 'app-activiter-recent-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './activiter-recent-tab.html',
  styleUrls: ['./activiter-recent-tab.css']
})
export class ActiviterRecentTab implements OnInit {

  encodeURIComponent = encodeURIComponent; // exposer la fonction JS globale

  projectId: number = 0;
  commentaires: Commentaire[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id && id > 0) {
        this.projectId = id;
        this.loadCommentaires();
      } else {
        this.error = "ID de projet invalide";
      }
    });
  }

  loadCommentaires(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Commentaire[]>(apiUrl(`/commentaires/projet/${this.projectId}`))
      .subscribe({
        next: (data) => {
          this.commentaires = data;
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des commentaires : ${err.message || 'Serveur inaccessible'}`;
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
  }
}
