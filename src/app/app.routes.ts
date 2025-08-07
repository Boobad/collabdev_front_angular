import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { ForgetPassword } from './contributeurs/pages/forget-password/forget-password';
import { Login } from './contributeurs/pages/login/login';
import { AdminDetailProjet } from './contributeurs/pages/admin-detail-projet/admin-detail-projet';

export const routes: Routes = [
{
    path: '', component: Login
},
{
    path: 'admin-detail-projet', component: AdminDetailProjet
},
{
    path: 'projects', component: Projects
},
{
    path: 'forget-password', component: ForgetPassword
},
{
    path: 'home', component: Home
}

];
