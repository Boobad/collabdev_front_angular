import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { FormulaireParticipation } from './contributeurs/pages/formulaire-participation/formulaire-participation';
import { DemarrageQuiz } from './contributeurs/pages/demarrage-quiz/demarrage-quiz';
import { Quiz } from './contributeurs/pages/quiz/quiz';
import { UsersList } from './contributeurs/pages/users-list/users-list';

export const routes: Routes = [
  {
    path: '',
    component: Home, // Page d'accueil par défaut
  },
  {
    path: 'projects',
    component: Projects, // Liste des projets
  },
  {
    path: 'formulaire-participation',
    component: FormulaireParticipation, // Formulaire de participation
  },
  {
    path: 'test/:role',
    component: DemarrageQuiz, // Redirige vers DemarrageQuiz pour un rôle spécifique (ajustement proposé)
    // Note : Si ce n'est pas l'intention, supprimez cette route ou remplacez par une redirection
  },
  {
    path: 'demarrage-quiz',
    component: DemarrageQuiz, // Page de démarrage du quiz
  },
  {
    path: 'quiz',
    component: Quiz, // Quiz interactif
  },
  {
    path: 'users-list',
    component: UsersList, // Liste des utilisateurs
  },
  {
    path: '**',
    redirectTo: '', // Route par défaut pour toutes les URL non reconnues
  },
];