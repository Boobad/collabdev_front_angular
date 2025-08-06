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
import { ProfilUser } from './contributeurs/pages/profil-user/profil-user';
import { Quiz } from './contributeurs/pages/quiz/quiz';
import { WorkspaceProject } from './contributeurs/pages/workspace-project/workspace-project';
import { WorkspaceProjectResources } from './contributeurs/pages/workspace-project-resources/workspace-project-resources';
import { FormSuscribe } from './contributeurs/pages/form-suscribe/form-suscribe';
import { SubmitContribution } from './contributeurs/pages/submit-contribution/submit-contribution';
import { TaskDetails } from './contributeurs/pages/task-details/task-details';

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
  path: 'profil-user', component: ProfilUser,
},
{
  path : 'quiz', component: Quiz,
},
{
  path: 'workspace-project', component: WorkspaceProject,
},
{
  path: 'workspace-projetc-resource', component: WorkspaceProjectResources,
},
{
  path: 'suscribe', component: FormSuscribe,
},
{
  path: 'submit-contribution', component: SubmitContribution,
},
{
  path: 'task-details', component: TaskDetails,
},
{
  path: '**',
  redirectTo: '',
}
];
