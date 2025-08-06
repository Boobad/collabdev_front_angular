import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { UpadateProfil } from './contributeurs/pages/upadate-profil/upadate-profil';
import { ProfilUser } from './contributeurs/pages/profil-user/profil-user';

export const routes: Routes = [
{
    path: '', component: ProfilUser
},
{
    path: 'projects', component: Projects
},
{
    path: 'update-profil', component: UpadateProfil
}
];
