import { Routes } from '@angular/router';
import { Login } from './features/auth/contributors/login/login';
import { Home } from './features/contributors/pages/home/home';
import { Projects } from './features/contributors/pages/projects/projects';
import { GestionFonctionnalite } from './features/contributors/pages/gestion-fonctionnalite/gestion-fonctionnalite';
import { ProjetsRecommandes } from './features/contributors/pages/projets-recommandes/projets-recommandes';
import { FormulaireParticipation } from './features/contributors/pages/formulaire-participation/formulaire-participation';
import { DemarrageQuiz } from './features/contributors/pages/demarrage-quiz/demarrage-quiz';
import { Coins } from './features/contributors/pages/coins/coins';
import { ParametrageCoins } from './features/admin/pages/parametrage-coins/parametrage-coins';
import { RecompenseBadge } from './features/contributors/pages/recompense-badge/recompense-badge';
import { PageContribution } from './features/contributors/pages/page-contribution/page-contribution';
import { ProfilUser } from './features/contributors/pages/profil-user/profil-user';
import { Quiz } from './features/contributors/pages/quiz/quiz';
import { WorkspaceProject } from './features/contributors/pages/workspace-project/workspace-project';
import { WorkspaceProjectResources } from './features/contributors/pages/workspace-project-resources/workspace-project-resources';
import { FormSuscribe } from './features/auth/contributors/form-suscribe/form-suscribe';
import { SubmitContribution } from './features/contributors/pages/submit-contribution/submit-contribution';
import { DetailsPages } from './features/contributors/pages/details-pages/details-pages';
import { ListeDemandeParticipation } from './features/contributors/pages/liste-demande-participation/liste-demande-participation';
import { LoginAdmin } from './features/auth/admin/login-admin/login-admin';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { AuthLayout } from './shared/layouts/auth-layout/auth-layout';
import { TaskDetails } from './features/contributors/pages/task-details/task-details';
import { authGuard } from './core/auth-guard';
import { Oauth2RedirectComponent } from './core/oauth2-redirect/oauth2-redirect';
import { ForgetPassword } from './features/auth/contributors/forget-password/forget-password';
import { Coinssolde } from './features/contributors/pages/coinssolde/coinssolde';
import { UpadateProfil } from './shared/ui-components/upadate-profil/upadate-profil';
import { ResetPassword } from './features/auth/contributors/reset-password/reset-password';
import { SearchPage } from './features/contributors/pages/search-page/search-page';


export const routes: Routes = [

  {
    path:'',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'projects', component: Projects },
      { path: 'profil-user', component: ProfilUser },
      { path: 'demarrage-quiz', component: DemarrageQuiz },
      { path: 'quiz', component: Quiz },
      { path: 'workspace-projetc-resource', component: WorkspaceProjectResources },
       { path: 'coins', component: Coinssolde },
        {path: 'update-profil/:id', component: UpadateProfil },
      { path: 'search', component: SearchPage },
             { path: 'badge-recompense', component: RecompenseBadge },
       { path: 'details/:id', component: DetailsPages },
      { path: 'workspace-project', component: WorkspaceProject },
       { path: 'projets-recommandes', component: ProjetsRecommandes },
       { path: 'formulaire-participation/:id', component: FormulaireParticipation },
        { path: 'voir-participation', component: ListeDemandeParticipation },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path:'',
    component: AuthLayout,
     children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },

      { path: 'login', loadComponent: () => import('./features/auth/contributors/login/login').then(m => m.Login) },
      { path: 'logAdmin', component: LoginAdmin },
      { path: 'suscribe', component: FormSuscribe },
      { path: 'reset', component: ResetPassword },
       { path: 'forgot', component: ForgetPassword },
      { path: 'oauth2-redirect', component: Oauth2RedirectComponent },


      { path: 'submit-contribution', component: SubmitContribution },
      { path: 'task-details', component: TaskDetails },

      { path: 'parametre-coins', component: ParametrageCoins },
      { path: 'badge-recompense', component: RecompenseBadge },
      { path: 'hist_contribution', component: PageContribution },
      { path: 'projets-recommandes', component: ProjetsRecommandes },
      { path: 'list-demande-participation', component: ListeDemandeParticipation },

      { path: 'gestion-fonctionnalite', component : GestionFonctionnalite },

    ]
  }
,
  { path: '**', redirectTo: '' } // Redirection pour les routes inconnues
];
