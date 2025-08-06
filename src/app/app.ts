import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navebar } from './contributeurs/components/shared/navebar/navebar';
import { Sidebar } from './contributeurs/components/shared/sidebar/sidebar';

import { Coins } from './contributeurs/pages/coins/coins';

import { ModalCreateProject } from './contributeurs/components/ui/modal-create-project/modal-create-project';
import { ParametrageCoins } from './component_admin_param/parametrage-coins/parametrage-coins';


@Component({
  selector: 'app-root',
  imports: [Sidebar,Navebar,Coins,ParametrageCoins, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('collabdev_frontend');
  
}
