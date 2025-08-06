import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { DetailsPages } from './contributeurs/pages/details-pages/details-pages';
import { Coinssolde } from './contributeurs/pages/coinssolde/coinssolde';

export const routes: Routes = [
{
    path: '', component: Home
},
{
    path: 'projects', component: Projects
},
{
    path: 'details', component: DetailsPages
},
{
    path: 'coins', component: Coinssolde
}
];
