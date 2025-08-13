import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSpinner, 
  faPlus, 
  faClock, 
  faComment, 
  faPaperclip, 
  faImage, 
  faCode 
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

interface Discussion {
  id: number;
  contenu: string;
  creationDate: string;
  auteurId: number;
  auteurNomComplet: string;
  auteurPhotoProfilUrl: string | null;
  parentId: number | null;
  reponses: Discussion[];
}

@Component({
  selector: 'app-discussion-details-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './discussion-details-tab.html',
  styleUrls: ['./discussion-details-tab.css']
})
export class DiscussionDetailsTab implements OnInit {
  // Configuration des icônes
  icons = {
    spinner: faSpinner,
    plus: faPlus,
    clock: faClock,
    comment: faComment,
    paperclip: faPaperclip,
    image: faImage,
    code: faCode
  };

  // Variables d'état
  discussions: Discussion[] = [];
  newDiscussionContent: string = '';
  replyContent: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  isReplying: number | null = null;
  
  // Données utilisateur et projet
  user: any = null;
  projectId: number = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadProjectId();
  }

  getInitials(name: string | null): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}


  private loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        console.error('data:', userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }

  private loadProjectId(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'] || 0;
      if (this.projectId) {
        this.loadDiscussions();
      }
    });
  }

  loadDiscussions(): void {
    this.isLoading = true;
    this.error = null;
    
    this.http.get<Discussion[]>(`http://localhost:8080/api/v1/commentaires/projet/${this.projectId}`)
      .subscribe({
        next: (data) => {
          this.discussions = data.filter(d => d.parentId === null);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading discussions:', err);
          this.error = 'Erreur lors du chargement des discussions';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  toggleReply(discussionId: number): void {
    this.isReplying = this.isReplying === discussionId ? null : discussionId;
    this.replyContent = '';
  }

  createDiscussion(): void {
    if (!this.newDiscussionContent.trim()) {
      this.error = 'Le contenu ne peut pas être vide';
      return;
    }

    const newDiscussion = {
      contenu: this.newDiscussionContent,
      parentId: null,
      auteurId: this.user.id,
      projetId: this.projectId
    };

    this.http.post(
      `http://localhost:8080/api/v1/commentaires/participant/${this.user.id}/projet/${this.projectId}`,
      newDiscussion
    ).subscribe({
      next: () => {
        this.newDiscussionContent = '';
        this.loadDiscussions();
      },
      error: (err) => {
        console.error('Error creating discussion:', err);
        this.error = 'Erreur lors de la création du commentaire';
      }
    });
  }

  postReply(parentId: number): void {
    if (!this.replyContent.trim()) {
      this.error = 'Le contenu ne peut pas être vide';
      return;
    }

    const reply = {
      contenu: this.replyContent,
      parentId: parentId,
      auteurId: this.user.id,
      projetId: this.projectId
    };

    this.http.post(
      `http://localhost:8080/api/v1/commentaires/participant/${this.user.id}/projet/${this.projectId}`,
      reply
    ).subscribe({
      next: () => {
        this.isReplying = null;
        this.replyContent = '';
        this.loadDiscussions();
      },
      error: (err) => {
        console.error('Error posting reply:', err);
        this.error = 'Erreur lors de la publication de la réponse';
      }
    });
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-profile.png';
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
}