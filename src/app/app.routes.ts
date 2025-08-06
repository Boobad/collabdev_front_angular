import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { Login } from './contributeurs/pages/login/login';
import { ProjetsRecommandes } from './contributeurs/pages/projets-recommandes/projets-recommandes';
import { GestionFonctionnalite } from './contributeurs/pages/gestion-fonctionnalite/gestion-fonctionnalite';
import { Container } from './contributeurs/pages/container/container';
import { FormulaireParticipation } from './contributeurs/pages/formulaire-participation/formulaire-participation';
import { DemarrageQuiz } from './contributeurs/pages/demarrage-quiz/demarrage-quiz';
import { Coins } from './contributeurs/pages/coins/coins';
import { ParametrageCoins } from './component_admin_param/parametrage-coins/parametrage-coins';
import { RecompenseBadge } from './contributeurs/pages/recompense-badge/recompense-badge';
import { PageContribution } from './contributeurs/pages/page-contribution/page-contribution';

export const routes: Routes = [
{
    path: '', component: Login
},
{
    path: 'container', component: Container
},
{
    path: 'home', component: Home
},
{
    path: 'projects', component: Projects
},
{
    path : 'gestion-fonctionnalite', component : GestionFonctionnalite
},
{
    path : 'projets-recommandes', component: ProjetsRecommandes
},
{
  path: 'test/:role', component: FormulaireParticipation,
},
{
  path: 'demarrage-quiz', component: DemarrageQuiz,
},
{
  path: 'demarrage-quiz', component: DemarrageQuiz,
},
{
  path: 'coins', component: Coins,
},
{
  path: 'parametre-coins', component: ParametrageCoins,
},
{
  path: 'badge-recompense', component: RecompenseBadge,
},
{
  path: 'hist_contribution', component: PageContribution,
}
,
{
  path: '**',
  redirectTo: '',
}
];
