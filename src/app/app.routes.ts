import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { TaskDetails } from './contributeurs/pages/task-details/task-details';

export const routes: Routes = [
{
    path: '', component: Home
},
{
    path: 'projects', component: Projects
},
{
  path: 'Tasks', component: TaskDetails
}
];
