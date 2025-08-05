import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './contributeurs/pages/home/home';
import { Projects } from './contributeurs/pages/projects/projects';
import { Coins } from './contributeurs/pages/coins/coins';

export const routes: Routes = [
{
    path: '', component: Home
},
{
    path: 'projects', component: Projects
},
{
    path : 'coins', component: Coins
}
];
