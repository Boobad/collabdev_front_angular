import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { AjoutProjet } from './contributeurs/pages/ajout-projet/ajout-projet';

export const routes: Routes = [
{
    path: '', component: Home
},
{
    path: 'projects', component: Projects
},
{
    path : 'ajoutProjet', component : AjoutProjet
}
];
