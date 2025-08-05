import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { RecompenseBadge } from './contributeurs/pages/recompense-badge/recompense-badge';
import { PageContribution } from './contributeurs/pages/page-contribution/page-contribution';

export const routes: Routes = [
  {
    path: 'badge-recompense',
    component: RecompenseBadge,
  },
  {
    path: 'hist_contribution',
    component: PageContribution,
  },
];
