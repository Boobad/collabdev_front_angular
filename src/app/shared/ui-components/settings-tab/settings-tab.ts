import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

type RoleType = 'développeur' | 'designer' | 'gestionnaire' | 'marketer' | 'productOwner';
type Feature = {
  id: string;
  title: string;
  description: string;
  criteria: string;
  requirements: string;
  deadline: string;
  status: 'todo' | 'inProgress' | 'done';
};

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CommonModule,
    FormsModule],
  templateUrl: './settings-tab.html',
  styleUrls: ['./settings-tab.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SettingsTab {
  projectForm: FormGroup;
  featureForm: FormGroup;
  selectedFile: File | null = null;
  features: Feature[] = [];
  uploadProgress = 0;
  uploadError: string | null = null;
  uploadInProgress = false;
  activeTab: 'project' | 'features' | 'quiz' = 'project';

  // Enhanced Quiz configuration
  quizQuestions = [
    {
      id: 1,
      text: "Quelle activité vous passionne le plus ?",
      options: [
        { text: "Résoudre des problèmes complexes avec du code", value: "dev", icon: "fa-code" },
        { text: "Créer des interfaces utilisateur magnifiques", value: "design", icon: "fa-paint-brush" },
        { text: "Organiser et manager une équipe", value: "manage", icon: "fa-users" },
        { text: "Développer des stratégies marketing", value: "marketing", icon: "fa-bullhorn" },
        { text: "Définir la vision produit", value: "product", icon: "fa-lightbulb" }
      ]
    },
    {
      id: 2,
      text: "Votre environnement de travail idéal ?",
      options: [
        { text: "Un espace calme avec des écrans multiples", value: "dev", icon: "fa-desktop" },
        { text: "Un studio créatif avec tablettes graphiques", value: "design", icon: "fa-palette" },
        { text: "Des salles de réunion avec tableaux blancs", value: "manage", icon: "fa-chalkboard" },
        { text: "Des espaces dynamiques pour brainstormer", value: "marketing", icon: "fa-comments" },
        { text: "Un mélange de tout ça", value: "product", icon: "fa-random" }
      ]
    },
    {
      id: 3,
      text: "Quel est votre super-pouvoir ?",
      options: [
        { text: "Transformer le café en code fonctionnel", value: "dev", icon: "fa-mug-hot" },
        { text: "Donner vie à des idées abstraites", value: "design", icon: "fa-magic" },
        { text: "Faire collaborer efficacement les gens", value: "manage", icon: "fa-handshake" },
        { text: "Comprendre parfaitement les besoins clients", value: "marketing", icon: "fa-chart-line" },
        { text: "Voir la big picture avant tout le monde", value: "product", icon: "fa-binoculars" }
      ]
    }
  ];

  quizAnswers: {[key: number]: string} = {};
  quizCompleted = false;
  recommendedRole!: RoleType;
  readonly roles: RoleType[] = ['développeur', 'designer', 'gestionnaire', 'marketer', 'productOwner'];
  roleDetails = {
    'développeur': {
      color: '#4cc9f0',
      icon: 'fa-code',
      description: 'Expert en développement logiciel'
    },
    'designer': {
      color: '#f8961e',
      icon: 'fa-paint-brush',
      description: 'Créateur d\'expériences utilisateur'
    },
    'gestionnaire': {
      color: '#7209b7',
      icon: 'fa-users-cog',
      description: 'Organisateur et leader d\'équipe'
    },
    'marketer': {
      color: '#f72585',
      icon: 'fa-bullhorn',
      description: 'Spécialiste en stratégie marketing'
    },
    'productOwner': {
      color: '#2b8a3e',
      icon: 'fa-lightbulb',
      description: 'Définisseur de vision produit'
    }
  };
Object: any;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      deadline: ['', Validators.required],
      category: ['web', Validators.required]
    });

    this.featureForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      criteria: ['', Validators.required],
      requirements: ['', Validators.required],
      deadline: ['', Validators.required],
      priority: ['medium', Validators.required]
    });

    this.loadProjectData();
  }

  loadProjectData() {
    this.projectForm.patchValue({
      title: 'Plateforme de télémédecine',
      description: 'Une solution innovante pour des consultations médicales à distance avec suivi des patients.',
      deadline: '2023-12-31',
      category: 'health'
    });

    this.features = [
      {
        id: this.generateId(),
        title: 'Chat en temps réel',
        description: 'Messagerie instantanée entre médecins et patients',
        criteria: 'End-to-end encryption, notifications push',
        requirements: 'WebSockets, Firebase',
        deadline: '2023-10-15',
        status: 'inProgress'
      },
      {
        id: this.generateId(),
        title: 'Gestion des rendez-vous',
        description: 'Calendrier de disponibilité des médecins',
        criteria: 'Sync avec Google Calendar, rappels automatiques',
        requirements: 'FullCalendar, SendGrid',
        deadline: '2023-11-20',
        status: 'todo'
      }
    ];
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadError = null;
    }
  }

  async uploadSpecs() {
    if (!this.selectedFile) return;

    this.uploadInProgress = true;
    this.uploadProgress = 0;
    this.uploadError = null;

    try {
      // Simulation d'upload avec progression réaliste
      const steps = [10, 20, 40, 60, 80, 95, 100];
      for (const progress of steps) {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
        this.uploadProgress = progress;
      }

      // En production: appel API ici
      // await this.apiService.uploadFile(this.selectedFile);

      this.selectedFile = null;
      this.showToast('Fichier uploadé avec succès !', 'success');
    } catch (error) {
      this.uploadError = "Échec de l'upload. Veuillez réessayer.";
      console.error(error);
      this.showToast('Erreur lors de l\'upload', 'error');
    } finally {
      this.uploadInProgress = false;
    }
  }

  updateProject() {
    if (this.projectForm.valid) {
      console.log('Projet mis à jour:', this.projectForm.value);
      this.showToast('Projet mis à jour avec succès', 'success');
    }
  }

  addFeature() {
    if (this.featureForm.valid) {
      const newFeature: Feature = {
        id: this.generateId(),
        ...this.featureForm.value,
        status: 'todo'
      };
      this.features.unshift(newFeature);
      this.featureForm.reset();
      this.showToast('Fonctionnalité ajoutée avec succès', 'success');
    }
  }

  removeFeature(id: string) {
    this.features = this.features.filter(f => f.id !== id);
    this.showToast('Fonctionnalité supprimée', 'warning');
  }

  updateFeatureStatus(id: string, status: 'todo' | 'inProgress' | 'done') {
    const feature = this.features.find(f => f.id === id);
    if (feature) {
      feature.status = status;
    }
  }

  // Quiz methods
  selectAnswer(questionId: number, answer: string) {
    this.quizAnswers[questionId] = answer;
  }

  isQuizComplete(): boolean {
    return Object.keys(this.quizAnswers).length === this.quizQuestions.length;
  }

  submitQuiz() {
    if (!this.isQuizComplete()) return;

    const roleScores: Record<string, number> = {
      'développeur': 0,
      'designer': 0,
      'gestionnaire': 0,
      'marketer': 0,
      'productOwner': 0
    };

    // Mapping des réponses aux rôles
    const answerMap: Record<string, RoleType[]> = {
      'dev': ['développeur'],
      'design': ['designer'],
      'manage': ['gestionnaire'],
      'marketing': ['marketer'],
      'product': ['productOwner']
    };

    // Calcul des scores
    for (const answer of Object.values(this.quizAnswers)) {
      const roles = answerMap[answer] || [];
      for (const role of roles) {
        roleScores[role]++;
      }
    }

    // Détermination du rôle recommandé
    let maxScore = 0;
    for (const [role, score] of Object.entries(roleScores)) {
      if (score > maxScore) {
        maxScore = score;
        this.recommendedRole = role as RoleType;
      }
    }

    this.quizCompleted = true;
    this.showToast('Quiz complété ! Découvrez votre rôle recommandé', 'success');
  }

  getRoleMatch(role: RoleType): number {
    const answerMap: Record<string, string[]> = {
      'développeur': ['dev'],
      'designer': ['design'],
      'gestionnaire': ['manage'],
      'marketer': ['marketing'],
      'productOwner': ['product']
    };

    const expectedAnswers = answerMap[role] || [];
    const matchCount = Object.values(this.quizAnswers)
      .filter(a => expectedAnswers.includes(a))
      .length;

    return Math.round((matchCount / this.quizQuestions.length) * 100);
  }

  getRoleSkills(role: RoleType): string[] {
    const skills: Record<RoleType, string[]> = {
      'développeur': [
        'Développement frontend/backend',
        'Architecture logicielle',
        'Résolution de problèmes complexes'
      ],
      'designer': [
        'Design UI/UX',
        'Prototypage interactif',
        'Design system'
      ],
      'gestionnaire': [
        'Gestion de projet Agile',
        'Coordination d\'équipe',
        'Planification stratégique'
      ],
      'marketer': [
        'Stratégie marketing digitale',
        'Analyse de marché',
        'Gestion de campagnes'
      ],
      'productOwner': [
        'Définition de roadmap produit',
        'Priorisation des features',
        'Analyse des besoins utilisateurs'
      ]
    };
    return skills[role] || [];
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    // Implémentation réelle nécessiterait un service de toast
    console.log(`Toast [${type}]: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  }

  setTab(tab: 'project' | 'features' | 'quiz') {
    this.activeTab = tab;
  }
}
