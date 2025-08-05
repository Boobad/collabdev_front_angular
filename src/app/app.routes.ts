import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { FormulaireParticipation } from './contributeurs/pages/formulaire-participation/formulaire-participation';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'projects',
    component: Projects,
  },
  { path: 'formulaire-participation', component: FormulaireParticipation },
];
