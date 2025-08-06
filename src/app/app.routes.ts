import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { FormulaireParticipation } from './contributeurs/pages/formulaire-participation/formulaire-participation';
import { DemarrageQuiz } from './contributeurs/pages/demarrage-quiz/demarrage-quiz';
import { Quiz } from './contributeurs/pages/quiz/quiz';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'projects',
    component: Projects,
  },
  {
    path: 'formulaire-participation',
    component: FormulaireParticipation,
  },
  {
    path: 'test/:role',
    component: FormulaireParticipation, // À réévaluer si vous voulez utiliser DemarrageQuiz ici
  },
  {
    path: 'demarrage-quiz', // Nouvelle route pour DemarrageQuiz
    component: DemarrageQuiz,
  },
  {
    path: 'quiz',
    component: Quiz,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
