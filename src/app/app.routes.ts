import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { Login } from './contributeurs/pages/login/login';
import { ProjetsRecommandes } from './contributeurs/pages/projets-recommandes/projets-recommandes';
import { GestionFonctionnalite } from './contributeurs/pages/gestion-fonctionnalite/gestion-fonctionnalite';
import { Container } from './contributeurs/pages/container/container';
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
}
];
